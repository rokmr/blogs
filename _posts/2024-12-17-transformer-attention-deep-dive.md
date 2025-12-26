---
title: "Transformer Attention: A Mathematical Deep Dive"
date: 2024-12-17
tags: [transformers, attention, deep-learning, tutorial]
math: true
comments: true
---

The attention mechanism is the core innovation behind transformers. Let's break it down mathematically and implement it from scratch.

> [!NOTE]
> This post assumes familiarity with basic linear algebra and neural networks. If you're new to these topics, check out my [prerequisites guide](#).

## The Attention Formula

At its heart, attention computes a weighted sum of values based on query-key similarity:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

Where:
- $Q$ = Query matrix of shape $(n, d_k)$
- $K$ = Key matrix of shape $(m, d_k)$  
- $V$ = Value matrix of shape $(m, d_v)$
- $d_k$ = Key/query dimension (scaling factor)

> [!TIP]
> Think of attention as a "soft" dictionary lookup: queries find relevant keys, and retrieve their associated values.

## Why Scale by $\sqrt{d_k}$?

The dot product $QK^T$ grows with dimension. For large $d_k$, the softmax saturates to one-hot vectors, killing gradients. Scaling by $\sqrt{d_k}$ keeps variance stable:

$$
\text{Var}(q \cdot k) = d_k \cdot \text{Var}(q_i) \cdot \text{Var}(k_i) = d_k
$$

After scaling: $\text{Var}\left(\frac{q \cdot k}{\sqrt{d_k}}\right) = 1$

> [!WARNING]
> Forgetting this scaling factor is a common bug! Without it, gradients vanish for $d_k > 64$.

## PyTorch Implementation

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k: int, dropout: float = 0.1):
        super().__init__()
        self.scale = d_k ** -0.5
        self.dropout = nn.Dropout(dropout)
    
    def forward(
        self, 
        query: torch.Tensor,  # (batch, n, d_k)
        key: torch.Tensor,    # (batch, m, d_k)
        value: torch.Tensor,  # (batch, m, d_v)
        mask: torch.Tensor = None
    ) -> tuple[torch.Tensor, torch.Tensor]:
        # Compute attention scores
        scores = torch.matmul(query, key.transpose(-2, -1)) * self.scale
        
        # Apply mask (for causal attention or padding)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))
        
        # Softmax over keys
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)
        
        # Weighted sum of values
        output = torch.matmul(attn_weights, value)
        
        return output, attn_weights
```

## Multi-Head Attention

Instead of a single attention function, transformers use multiple "heads" in parallel:

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, ..., \text{head}_h)W^O
$$

where $\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$

> [!QUESTION]
> Why use multiple heads instead of one large attention? Answer: Each head can attend to different aspects of the input (syntax, semantics, position, etc.).

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0
        
        self.d_k = d_model // n_heads
        self.n_heads = n_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
        self.attention = ScaledDotProductAttention(self.d_k, dropout)
    
    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)
        
        # Linear projections and reshape for multi-head
        Q = self.W_q(query).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.n_heads, self.d_k).transpose(1, 2)
        
        # Apply attention
        x, attn = self.attention(Q, K, V, mask)
        
        # Concatenate heads and project
        x = x.transpose(1, 2).contiguous().view(batch_size, -1, self.n_heads * self.d_k)
        return self.W_o(x), attn
```

## Complexity Analysis

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| $QK^T$ computation | $O(n \cdot m \cdot d_k)$ | $O(n \cdot m)$ |
| Softmax | $O(n \cdot m)$ | $O(n \cdot m)$ |
| Attention × Value | $O(n \cdot m \cdot d_v)$ | $O(n \cdot d_v)$ |
| **Total** | $O(n \cdot m \cdot d)$ | $O(n \cdot m)$ |

For self-attention ($n = m$), this is **quadratic** in sequence length — the main bottleneck for long sequences.

## Interactive Demo

Try this attention visualization on Hugging Face:

<div class="hf-space" data-src="exbert-project/exbert" data-height="600"></div>

## Try It Yourself

Run this simple attention calculation directly in your browser:

<div class="runnable" data-lang="python" markdown="1">

```python
import numpy as np

# Simple attention example (no PyTorch needed!)
def softmax(x):
    exp_x = np.exp(x - np.max(x, axis=-1, keepdims=True))
    return exp_x / np.sum(exp_x, axis=-1, keepdims=True)

def attention(Q, K, V):
    d_k = K.shape[-1]
    scores = Q @ K.T / np.sqrt(d_k)
    weights = softmax(scores)
    return weights @ V, weights

# Create sample query, key, value vectors
np.random.seed(42)
Q = np.random.randn(2, 4)  # 2 queries, dim 4
K = np.random.randn(3, 4)  # 3 keys
V = np.random.randn(3, 4)  # 3 values

output, attn_weights = attention(Q, K, V)

print("Query shape:", Q.shape)
print("Key shape:", K.shape)
print("Value shape:", V.shape)
print("\nAttention weights (which keys each query attends to):")
print(np.round(attn_weights, 3))
print("\nOutput shape:", output.shape)
```

</div>

## Key Takeaways

> [!TIP]
> **Summary**: Attention is a "soft dictionary" — queries find keys, retrieve values. Multi-head attention learns multiple perspectives. The $\sqrt{d_k}$ scaling prevents gradient issues.

1. **Attention is a soft dictionary lookup**: queries find relevant keys, retrieve values
2. **Scaling prevents gradient vanishing** in high dimensions
3. **Multi-head = multiple perspectives** on the same input
4. **Quadratic complexity** motivates efficient variants (Flash Attention, Linear Attention)

---

## New Feature Showcase

This section demonstrates the new "Second Brain" features added to the blog.

### Enhanced Callouts

> [!ABSTRACT]
> This post provides a mathematical deep-dive into the attention mechanism, the core innovation behind transformer architectures. We cover scaled dot-product attention, multi-head attention, complexity analysis, and provide interactive implementations.

> [!DEFINITION]
> **Scaled Dot-Product Attention** is a function that maps a query and a set of key-value pairs to an output, where the output is computed as a weighted sum of the values, with weights determined by the compatibility of the query with the corresponding keys.

> [!PROOF]
> **Variance Stability Proof**: Let $q_i, k_i \sim \mathcal{N}(0, 1)$ be i.i.d. standard normal. Then $\text{Var}(q \cdot k) = \sum_{i=1}^{d_k} \text{Var}(q_i k_i) = d_k$. Dividing by $\sqrt{d_k}$ gives $\text{Var}\left(\frac{q \cdot k}{\sqrt{d_k}}\right) = 1$. ∎

> [!EXAMPLE]
> For a 3-token sequence "The cat sat", self-attention allows "sat" to attend to "cat" (subject) with high weight, while "The" attends mostly to itself since it's a common determiner.

> [!CRITICAL]
> **GPU Memory Warning**: Attention's $O(n^2)$ space complexity means a sequence of length 8192 requires ~256MB just for the attention matrix (float32). This is why Flash Attention and memory-efficient variants are essential for long-context models!

> [!SUCCESS]
> After implementing attention correctly with proper scaling, you should see smooth training curves and stable gradients even with $d_k = 512$ or higher.

### Collapsible Code Block

The full multi-head attention implementation is hidden by default to keep the article clean:

<div class="collapsible" data-label="Show Full Transformer Block" markdown="1">

```python
class TransformerBlock(nn.Module):
    """Complete transformer block with attention, FFN, and residual connections."""
    
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        
        # Multi-head attention
        self.attention = MultiHeadAttention(d_model, n_heads, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        
        # Feed-forward network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model),
            nn.Dropout(dropout)
        )
        self.norm2 = nn.LayerNorm(d_model)
        
    def forward(self, x, mask=None):
        # Self-attention with residual
        attn_out, _ = self.attention(x, x, x, mask)
        x = self.norm1(x + attn_out)
        
        # FFN with residual
        ffn_out = self.ffn(x)
        x = self.norm2(x + ffn_out)
        
        return x

# Example usage
block = TransformerBlock(d_model=512, n_heads=8, d_ff=2048)
x = torch.randn(2, 100, 512)  # batch=2, seq_len=100, d_model=512
output = block(x)
print(f"Input: {x.shape} -> Output: {output.shape}")
```

</div>

### Video Demo (Example Syntax)

Here's how you can embed videos showing your model in action:

<div class="video-embed" data-src="https://www.youtube.com/watch?v=kCc8FmEb1nY" data-caption="Andrej Karpathy's excellent 'Let's build GPT' tutorial"></div>

### Image Comparison Slider

Drag the slider to compare raw vs processed attention patterns:

<div class="image-compare" 
     data-before="/blogs/assets/images/attention_before.png" 
     data-after="/blogs/assets/images/attention_after.png">
  <span class="compare-label-before">Raw</span>
  <span class="compare-label-after">Processed</span>
</div>

**Usage syntax:**
```html
<div class="image-compare" 
     data-before="/path/to/before.png" 
     data-after="/path/to/after.png">
  <span class="compare-label-before">Before</span>
  <span class="compare-label-after">After</span>
</div>
```


### Summary of New Markdown Syntax

| Feature | Syntax |
|---------|--------|
| Abstract | `> [!ABSTRACT]` |
| Definition | `> [!DEFINITION]` |
| Proof | `> [!PROOF]` |
| Example | `> [!EXAMPLE]` |
| Critical | `> [!CRITICAL]` |
| Success | `> [!SUCCESS]` |
| Collapsible Code | `<div class="collapsible">...</div>` |
| Video Embed | `<div class="video-embed" data-src="URL">` |
| Image Compare | `<div class="image-compare" data-before="..." data-after="...">` |

---

*Next post: We'll implement Flash Attention and benchmark against naive attention.*
