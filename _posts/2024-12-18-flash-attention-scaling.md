---
title: "Flash Attention: Making Transformers Scale"
date: 2024-12-18
tags: [transformers, attention, optimization, flash-attention, gpu]
math: true
comments: true
---

In my [previous post on Transformer Attention](/blogs/posts/transformer-attention-deep-dive/), we explored the mathematical foundations of attention. The key limitation? **Quadratic memory complexity** $O(n^2)$ makes long sequences prohibitively expensive. Flash Attention solves this.

> [!NOTE]
> Flash Attention achieves **2-4x speedup** and dramatically reduces memory usage without any approximation — it's mathematically identical to standard attention.

## The Memory Bottleneck Problem

Standard attention computes and stores the full $n \times n$ attention matrix:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

For a sequence of length 8192 with batch size 1:
- Attention matrix: $8192^2 \times 4$ bytes = **256 MB** per head
- With 32 heads: **8 GB** just for attention weights!

> [!CRITICAL]
> This quadratic scaling is why GPT-3 was limited to 2048 tokens, and why long-context models like Claude and GPT-4 required architectural innovations.

## Flash Attention: The Key Insight

Flash Attention exploits the **memory hierarchy** of modern GPUs:

| Memory Type | Size | Bandwidth |
|-------------|------|-----------|
| SRAM (on-chip) | ~20 MB | ~19 TB/s |
| HBM (GPU RAM) | 40-80 GB | ~1.5 TB/s |

The insight: **Memory I/O is the bottleneck, not compute**. Standard attention:
1. Loads Q, K from HBM → computes $QK^T$ → writes to HBM
2. Loads $QK^T$ from HBM → computes softmax → writes to HBM
3. Loads softmax output from HBM → multiplies by V → writes to HBM

Flash Attention fuses all operations into a **single kernel** that keeps intermediate results in fast SRAM.

## The Tiling Algorithm

Flash Attention processes the attention matrix in **tiles** that fit in SRAM:

```python
# Pseudocode for Flash Attention forward pass
def flash_attention(Q, K, V, block_size=64):
    """
    Tiled attention computation.
    Q, K, V: (batch, seq_len, d_head)
    """
    n = Q.shape[1]
    output = torch.zeros_like(Q)
    
    # Process in blocks
    for i in range(0, n, block_size):
        q_block = Q[:, i:i+block_size]
        
        # Track running max and normalizer for numerical stability
        m_i = torch.full((q_block.shape[0], block_size), float('-inf'))
        l_i = torch.zeros((q_block.shape[0], block_size))
        o_i = torch.zeros_like(q_block)
        
        for j in range(0, n, block_size):
            k_block = K[:, j:j+block_size]
            v_block = V[:, j:j+block_size]
            
            # Compute attention scores for this tile
            scores = q_block @ k_block.transpose(-1, -2) / math.sqrt(d_k)
            
            # Online softmax update
            m_ij = torch.max(scores, dim=-1).values
            m_new = torch.maximum(m_i, m_ij)
            
            # Rescale and accumulate
            alpha = torch.exp(m_i - m_new)
            beta = torch.exp(m_ij - m_new)
            
            l_i = alpha * l_i + beta * torch.sum(torch.exp(scores - m_ij), dim=-1)
            o_i = alpha * o_i + beta * (torch.exp(scores - m_ij) @ v_block)
            m_i = m_new
        
        # Final normalization
        output[:, i:i+block_size] = o_i / l_i.unsqueeze(-1)
    
    return output
```

> [!TIP]
> The magic is the **online softmax** algorithm — we can compute exact softmax incrementally without storing the full attention matrix!

## Online Softmax: The Mathematical Trick

Standard softmax requires two passes:
1. Find max for numerical stability
2. Compute exp and normalize

Online softmax does it in **one pass** using running statistics:

$$
m^{(j)} = \max(m^{(j-1)}, \max(S_{:,j}))
$$

$$
\ell^{(j)} = e^{m^{(j-1)} - m^{(j)}} \ell^{(j-1)} + \sum_i e^{S_{i,j} - m^{(j)}}
$$

$$
O^{(j)} = e^{m^{(j-1)} - m^{(j)}} O^{(j-1)} + e^{S_{:,j} - m^{(j)}} V_j
$$

> [!PROOF]
> **Correctness**: At convergence, $O/\ell$ equals the exact attention output. This follows from the distributive property of the softmax normalization. ∎

## Memory Complexity Comparison

| Algorithm | Memory | I/O Complexity |
|-----------|--------|----------------|
| Standard Attention | $O(n^2)$ | $O(n^2 d + n^2)$ |
| Flash Attention | $O(n)$ | $O(n^2 d^2 / M)$ |

Where $M$ is SRAM size (~20 MB) and $d$ is head dimension (~64-128).

> [!SUCCESS]
> For typical transformer configs, Flash Attention reduces memory from **quadratic to linear** in sequence length!

## Practical Performance

<div class="collapsible" data-label="Show Benchmark Results">

```python
import torch
from flash_attn import flash_attn_func
import time

def benchmark_attention(seq_len, n_heads=32, d_head=64, batch=1):
    """Compare standard vs Flash Attention"""
    
    device = 'cuda'
    q = torch.randn(batch, seq_len, n_heads, d_head, device=device, dtype=torch.float16)
    k = torch.randn(batch, seq_len, n_heads, d_head, device=device, dtype=torch.float16)
    v = torch.randn(batch, seq_len, n_heads, d_head, device=device, dtype=torch.float16)
    
    # Warmup
    for _ in range(10):
        _ = flash_attn_func(q, k, v)
    torch.cuda.synchronize()
    
    # Flash Attention
    start = time.time()
    for _ in range(100):
        _ = flash_attn_func(q, k, v)
    torch.cuda.synchronize()
    flash_time = (time.time() - start) / 100
    
    # Standard attention (for comparison, smaller seq_len)
    q_std = q.transpose(1, 2)
    k_std = k.transpose(1, 2)
    v_std = v.transpose(1, 2)
    
    start = time.time()
    for _ in range(100):
        attn = torch.matmul(q_std, k_std.transpose(-2, -1)) / (d_head ** 0.5)
        attn = torch.softmax(attn, dim=-1)
        _ = torch.matmul(attn, v_std)
    torch.cuda.synchronize()
    std_time = (time.time() - start) / 100
    
    print(f"Seq len {seq_len}: Flash={flash_time*1000:.2f}ms, Std={std_time*1000:.2f}ms, Speedup={std_time/flash_time:.2f}x")

# Run benchmarks
for seq_len in [1024, 2048, 4096, 8192]:
    benchmark_attention(seq_len)
```

**Typical results on A100:**
| Sequence Length | Standard | Flash Attention | Speedup |
|-----------------|----------|-----------------|---------|
| 1024 | 1.2 ms | 0.4 ms | 3.0x |
| 2048 | 4.8 ms | 1.2 ms | 4.0x |
| 4096 | 19.2 ms | 4.1 ms | 4.7x |
| 8192 | OOM | 15.3 ms | ∞ |

</div>

## Using Flash Attention in Practice

### With Hugging Face Transformers

```python
from transformers import AutoModelForCausalLM

# Flash Attention 2 is enabled automatically for supported models
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-7b-hf",
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2"
)
```

### Direct Usage with flash-attn Library

```python
from flash_attn import flash_attn_func

# Q, K, V shape: (batch, seq_len, n_heads, head_dim)
output = flash_attn_func(q, k, v, causal=True)
```

> [!WARNING]
> Flash Attention requires **GPU with compute capability >= 8.0** (Ampere or newer). For older GPUs, consider xFormers or PyTorch's built-in `scaled_dot_product_attention`.

## Flash Attention 2 & 3

Flash Attention has evolved:

**Flash Attention 2** (2023):
- Better work partitioning across GPU threads
- 2x faster than FA1
- Better parallelism for small batch sizes

**Flash Attention 3** (2024):
- Exploits Hopper architecture (H100)
- Asynchronous operations  
- 1.5-2x faster than FA2 on H100

## Key Takeaways

> [!TIP]
> **Summary**: Flash Attention is **IO-aware** — it minimizes memory transfers between GPU HBM and SRAM. By tiling the computation and using online softmax, it achieves linear memory with no approximation.

1. **Memory I/O is the bottleneck**, not compute — Flash Attention optimizes for this
2. **Tiling + online softmax** = exact attention with linear memory
3. **2-4x speedup** with **10-20x memory reduction** for long sequences
4. **Drop-in replacement** — mathematically identical to standard attention

---

*Previous: [Transformer Attention: A Mathematical Deep Dive](/blogs/posts/transformer-attention-deep-dive/)*
