---
title: "The Transformer Architecture"
description: "Self-Attention, Multi-Head Attention, and the Encoder-Decoder structure"
subject: deep-learning
math: true
tags: [attention, deep-learning, dl, jay-alammar, neural-networks, nlp, transformer, transformers]
status: wip
sitemap: false
order: 1
---

## Overview

Before Transformers, sequence modeling relied on Recurrent Neural Networks (RNNs) and LSTMs. These models processed data sequentially (one token at a time), which made them slow to train and prone to forgetting long-term dependencies. 

The **Transformer** (introduced in *"Attention Is All You Need"* in 2017) revolutionized AI by abandoning recurrence entirely. Instead, it relies on a mechanism called **Self-Attention** to process all tokens in a sequence simultaneously, allowing for massive parallelization and a much deeper understanding of context.

A fantastic visual resource for understanding this is [Jay Alammar's Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/).

## The Architecture

The original Transformer consists of two main stacks:
1. **The Encoder:** Reads the input sequence and builds a deep, context-aware mathematical representation of it.
2. **The Decoder:** Takes the Encoder's representation and generates an output sequence token by token.

*(Note: Modern LLMs like GPT are often "Decoder-only" architectures, while BERT is "Encoder-only".)*

### 1. Word Embeddings & Positional Encoding
Because Transformers process everything simultaneously, they inherently have no concept of word order. 
- **Word Embeddings:** Words are first mapped into continuous vector spaces (e.g., a 512-dimensional vector).
- **Positional Encoding:** A mathematical pattern (usually sine/cosine functions) is added to the word embedding to inject information about the word's physical position in the sentence.

### 2. Self-Attention
Self-Attention allows the model to look at other words in the input sequence as it processes a specific word. 
For example, in the sentence *"The animal didn't cross the street because it was too tired"*, self-attention helps the model realize that "it" refers to the "animal", not the "street".

#### The Q, K, V Matrices
For each token, the model creates three vectors by multiplying the embedding by three trained weight matrices:
- **Query (Q):** What I am looking for.
- **Key (K):** What I can offer.
- **Value (V):** What I actually am.

**The Calculation:**
1. Take the Query of the current word and calculate the dot product with the Keys of every other word. This generates a "Score" representing how much focus to place on other parts of the sentence.
2. Divide the score by the square root of the dimension of the key vectors (for gradient stability) and pass it through a Softmax operation to turn it into probabilities (0 to 1).
3. Multiply the Softmax scores by the Value vectors and sum them up.

$$ \text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V $$

### 3. Multi-Head Attention
Instead of performing a single self-attention operation, the Transformer computes multiple attention "heads" in parallel.
- **Why?** It expands the model's ability to focus on different positions. One attention head might focus on figuring out what a pronoun refers to, while another head simultaneously focuses on the grammatical structure or verb tense.
- The outputs of all heads are concatenated and multiplied by a final weight matrix.

### 4. Feed-Forward Neural Network
After self-attention, the resulting vector for each position is passed through a standard Feed-Forward Neural Network (FFNN). This FFNN is applied independently to each position, adding non-linearity (via ReLu or GELU activations) and expanding the representation before the next layer.

### 5. Residuals and Layer Normalization
Every sub-layer (Self-Attention and FFNN) has a **residual connection** around it, followed by **Layer Normalization**. This helps gradients flow cleanly through deep networks, preventing the vanishing gradient problem.
