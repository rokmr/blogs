---
title: "Lec 03 - Policy Gradients"
date: 2025-01-26
description: "Policy gradient derivation, REINFORCE, variance reduction, off-policy methods"
tags: [reinforcement-learning, cs224r, policy-gradient, REINFORCE]
subject: rl
math: true
slides:
  - title: "Lecture 03 - Policy Gradients"
    url: "/assets/resources/notes/rl/CS224R/03_cs224r_policy_gradients_2025.pdf"
references:
  - title: "Lecture 03 Video"
    url: "https://www.youtube.com/watch?v=KCAOXd4IO9o"
    authors: "Chelsea Finn, Sergey Levine"
    venue: "CS224R Stanford"
    year: 2025
  - title: "Lecture 03 Slides"
    url: "https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2025.pdf"
    authors: "Chelsea Finn, Sergey Levine"
    venue: "CS224R Stanford"
    year: 2025
---

# Policy Gradient Methods

## Core RL Objective

$$\theta^\star = \arg\max_{\theta} \; \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \sum_t r(s_t, a_t) \right]$$

where trajectory $\tau = (s_1, a_1, s_2, \ldots, s_T, a_T)$ and $p_\theta(\tau) = p(s_1) \prod_t \pi_\theta(a_t|s_t) p(s_{t+1}|s_t, a_t)$

## Policy Gradient Derivation

### Step 1: Express objective as expectation

$$J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ r(\tau) \right] = \int p_\theta(\tau) r(\tau) d\tau$$

where $r(\tau) = \sum_t r(s_t, a_t)$ is the total trajectory reward.

### Step 2: Take gradient

$$\nabla_\theta J(\theta) = \nabla_\theta \int p_\theta(\tau) r(\tau) d\tau = \int \nabla_\theta p_\theta(\tau) r(\tau) d\tau$$

### Step 3: Log-derivative trick

**Key identity:** $\nabla_\theta \log p_\theta(\tau) = \frac{\nabla_\theta p_\theta(\tau)}{p_\theta(\tau)}$

Therefore: $\nabla_\theta p_\theta(\tau) = p_\theta(\tau) \nabla_\theta \log p_\theta(\tau)$

**Derivation of identity:**
$$\nabla_\theta \log p_\theta(\tau) = \nabla_\theta \log p_\theta(\tau) \cdot \frac{p_\theta(\tau)}{p_\theta(\tau)} = \frac{\nabla_\theta p_\theta(\tau)}{p_\theta(\tau)}$$

Substituting back:

$$\nabla_\theta J(\theta) = \int p_\theta(\tau) \nabla_\theta \log p_\theta(\tau) r(\tau) d\tau$$

$$= \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \nabla_\theta \log p_\theta(\tau) \cdot r(\tau) \right]$$

### Step 4: Simplify log probability

Recall: $p_\theta(\tau) = p(s_1) \prod_t \pi_\theta(a_t|s_t) p(s_{t+1}|s_t, a_t)$

Taking log:

$$\log p_\theta(\tau) = \log p(s_1) + \sum_t \log \pi_\theta(a_t|s_t) + \sum_t \log p(s_{t+1}|s_t, a_t)$$

Taking gradient (only policy $\pi_\theta$ depends on $\theta$):

$$\nabla_\theta \log p_\theta(\tau) = \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)$$

### Step 5: Final policy gradient formula

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \left(\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)\right) \left(\sum_t r(s_t, a_t)\right) \right]$$

### Step 6: Monte Carlo estimate

$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \left(\sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t})\right) \left(\sum_{t=1}^T r(s_{i,t}, a_{i,t})\right)$$

## REINFORCE Algorithm (Vanilla Policy Gradient)

**Loop:**
1. **Sample** trajectories $\{\tau^i\}$ from current policy $\pi_\theta(a_t|s_t)$
2. **Compute gradient:** 
   $$\nabla_\theta J(\theta) \approx \sum_i \left(\sum_t \nabla_\theta \log \pi_\theta(a_t^i|s_t^i)\right) \left(\sum_t r(s_t^i, a_t^i)\right)$$
3. **Update:** $\theta \leftarrow \theta + \alpha \nabla_\theta J(\theta)$

**Intuition:** 
- Increase log-probability of actions taken in high-reward trajectories
- Decrease log-probability of actions taken in low-reward trajectories
- Formalization of "trial-and-error" learning

### Relationship to Imitation Learning

**Imitation Learning (Behavioral Cloning) objective:**

$$\min_{\theta} -\mathbb{E}_{(s,a) \sim \mathcal{D}} [\log \pi_\theta(a|s)]$$

This is equivalent to maximizing: $\mathbb{E}_{(s,a) \sim \mathcal{D}} [\log \pi_\theta(a|s)]$

**Gradient:**
$$\nabla_\theta J_{BC}(\theta) = \mathbb{E}_{(s,a) \sim \mathcal{D}} [\nabla_\theta \log \pi_\theta(a|s)]$$

**Policy Gradient can be seen as "weighted imitation learning":**

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \left(\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)\right) \left(\sum_t r(s_t, a_t)\right) \right]$$

**Key differences:**

| Aspect | Imitation Learning | Policy Gradient |
|--------|-------------------|-----------------|
| **Data source** | Expert demonstrations | Self-generated trajectories |
| **Weighting** | All actions weighted equally | Actions weighted by trajectory reward |
| **Objective** | Mimic expert behavior | Maximize expected reward |
| **Gradient** | $\nabla_\theta \log \pi_\theta(a|s)$ | $\nabla_\theta \log \pi_\theta(a|s) \cdot r(\tau)$ |

**Connection:**
- If all rewards are equal ($r(\tau) = c$ for all $\tau$), policy gradient reduces to behavioral cloning
- Policy gradient = imitation learning where you imitate your own good behaviors (high reward) and avoid your own bad behaviors (low reward)
- Both use the same $\nabla_\theta \log \pi_\theta(a|s)$ term, but PG adds reward-based weighting

## Variance Reduction Techniques

### 1. Causality (Reward-to-Go)

**Key insight:** Policy at time $t$ cannot affect rewards at time $t' < t$

Using causality, we only weight by **future rewards**:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_t|s_t) \left(\sum_{t'=t}^T r(s_{t'}, a_{t'})\right) \right]$$

**Derivation:**

Starting from:
$$\nabla_\theta J(\theta) = \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \sum_{t'=1}^T r(s_{i,t'}, a_{i,t'})$$

We can rearrange as:
$$= \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \left(\sum_{t'=1}^{t-1} r(s_{i,t'}, a_{i,t'}) + \sum_{t'=t}^T r(s_{i,t'}, a_{i,t'})\right)$$

The first term $\sum_{t'=1}^{t-1} r(s_{i,t'}, a_{i,t'})$ doesn't depend on $a_t$, so:

$$\mathbb{E}_{\tau} \left[\nabla_\theta \log \pi_\theta(a_t|s_t) \sum_{t'=1}^{t-1} r(s_{t'}, a_{t'})\right] = 0$$

This leaves only future rewards.

### 2. Baselines

**Subtract a constant baseline** $b$ (typically average reward):

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \nabla_\theta \log p_\theta(\tau) (r(\tau) - b) \right]$$

**Common choice:** $b = \frac{1}{N} \sum_i r(\tau^i)$ (average reward across batch)

**Proof of unbiasedness:**

We need to show: $\mathbb{E}_{\tau} [\nabla_\theta \log p_\theta(\tau) \cdot b] = 0$

$$\mathbb{E}_{\tau} [\nabla_\theta \log p_\theta(\tau) \cdot b] = \int p_\theta(\tau) \nabla_\theta \log p_\theta(\tau) \cdot b \, d\tau$$

$$= b \int p_\theta(\tau) \frac{\nabla_\theta p_\theta(\tau)}{p_\theta(\tau)} d\tau = b \int \nabla_\theta p_\theta(\tau) d\tau$$

$$= b \nabla_\theta \int p_\theta(\tau) d\tau = b \nabla_\theta 1 = 0$$

**Effect:** 
- Actions in above-average trajectories get positive gradients (increase probability)
- Actions in below-average trajectories get negative gradients (decrease probability)

### 3. Combined: Causality + Baseline

$$\nabla_\theta J(\theta) \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'}) - b\right)$$

## Implementation: Surrogate Objective

### Why We Need a Surrogate

**Problem:** We derived the gradient $\nabla_\theta J(\theta)$ mathematically, but computing $\nabla_\theta \log \pi_\theta(a|s)$ manually for a neural network is impractical.

**Solution:** Construct a scalar function $\tilde{J}(\theta)$ whose gradient equals our derived policy gradient, then use automatic differentiation.

### The Surrogate Function

$$\tilde{J}(\theta) = \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \log \pi_\theta(a_{i,t}|s_{i,t}) \left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'}) - b\right)$$

**Key insight:** When we differentiate $\tilde{J}(\theta)$:

$$\nabla_\theta \tilde{J}(\theta) = \frac{1}{N} \sum_i \sum_t \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'}) - b\right)$$

This is **exactly our policy gradient** from the derivation! The reward terms are constants, so they pass through the gradient operator unchanged.

### Workflow

1. **Derive mathematically:** $\nabla_\theta J(\theta)$ (what we want)
2. **Construct surrogate:** $\tilde{J}(\theta)$ (scalar function without $\nabla_\theta$)
3. **Let autodiff compute:** $\nabla_\theta \tilde{J}(\theta) = \nabla_\theta J(\theta)$ automatically

### Implementation
```python
# Define surrogate (no gradient symbol in code!)
log_probs = policy(states).log_prob(actions)
rewards_to_go = compute_rewards_to_go(rewards) - baseline
surrogate = (log_probs * rewards_to_go).mean()

# Autodiff computes the gradient for us
loss = -surrogate  # Negative for gradient ascent
loss.backward()    # PyTorch computes ∇_θ surrogate = ∇_θ J
optimizer.step()
```

### Policy Parameterizations

**Discrete actions (Cross-Entropy):**
- Network outputs logits, apply softmax: $\pi_\theta(a|s) = \text{softmax}(f_\theta(s))_a$
- Surrogate uses: $\log \pi_\theta(a|s)$
- Resembles classification loss

**Continuous actions (Gaussian):**
- Network outputs mean: $\mu_\theta(s)$, with variance $\sigma^2$
- Action sampled: $a \sim \mathcal{N}(\mu_\theta(s), \sigma^2)$
- Log prob: $\log \pi_\theta(a|s) \propto -\frac{1}{2\sigma^2}\|a - \mu_\theta(s)\|^2$
- Surrogate uses squared error form
## Challenges & Practical Considerations

### Problem 1: High Variance

**Issues:**
- Policy gradients are noisy/high-variance even with tricks
- Sensitive to reward scale
- Worse for sparse rewards (e.g., most trajectories may have zero reward)

**Example (from slides):**
- Humanoid walking: Only some trajectories move forward, most fall
- Jacket folding: Only 1 out of 4 trajectories succeeds

**Solutions:**
- Use **large batch sizes** (more trajectories per update)
- Use **dense reward shaping** when possible
- Apply both causality and baselines
- Consider more advanced methods (PPO, TRPO)

### Problem 2: On-Policy Constraint

**Definition:**
- **On-policy:** Algorithm uses only data from current policy $\pi_\theta$
- **Off-policy:** Algorithm can reuse data from past policies

**Issue with vanilla PG:**
- Gradient formula requires $\tau \sim \pi_\theta$ (current policy)
- After updating $\theta \rightarrow \theta'$, old trajectories are invalid
- Must recollect data after every update (sample inefficient)

**Why vanilla PG is on-policy:**

The expectation $\mathbb{E}_{\tau \sim \pi_\theta}$ is with respect to the current policy. After $\theta$ changes, the distribution changes, so old samples don't represent the new policy.

## Summary

**Key equations:**

1. **Policy gradient theorem:**
   $$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \left(\sum_t \nabla_\theta \log \pi_\theta(a_t|s_t)\right) r(\tau) \right]$$

2. **With causality:**
   $$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t) \sum_{t'=t}^T r(s_{t'}, a_{t'}) \right]$$

3. **With baseline:**
   $$\nabla_\theta J(\theta) = \mathbb{E}_{\tau \sim p_\theta(\tau)} \left[ \sum_t \nabla_\theta \log \pi_\theta(a_t|s_t) \left(\sum_{t'=t}^T r(s_{t'}, a_{t'}) - b\right) \right]$$

**Key takeaways:**
- Do more of what worked (high reward), less of what didn't (low reward)
- Use causality (reward-to-go) and baselines to reduce variance
- Method is on-policy and requires careful tuning
- Trade-off: Simple and general, but high variance and sample inefficient

## Off-Policy Policy Gradients

### Motivation: Sample Efficiency Problem

**On-policy limitation:** Vanilla policy gradient requires trajectories from current policy $\pi_{\theta'}$
- After each gradient update $\theta \rightarrow \theta'$, all old data becomes invalid
- Must recollect entirely new trajectories
- Extremely sample inefficient

**Goal:** Reuse data from old policy $\pi_\theta$ to update new policy $\pi_{\theta'}$

### IS: Importance Sampling

**Key idea:** Convert expectation under one distribution to expectation under another

$$\mathbb{E}_{\tau \sim p_{\theta'}(\tau)}[f(\tau)] = \mathbb{E}_{\tau \sim p_{\theta}(\tau)}\left[\frac{p_{\theta'}(\tau)}{p_{\theta}(\tau)} f(\tau)\right]$$

**Importance weight:** $\frac{p_{\theta'}(\tau)}{p_{\theta}(\tau)}$

For trajectories, this ratio expands to:

$$\frac{p_{\theta'}(\tau)}{p_{\theta}(\tau)} = \frac{p(s_1) \prod_{t=1}^T \pi_{\theta'}(a_t|s_t) p(s_{t+1}|s_t, a_t)}{p(s_1) \prod_{t=1}^T \pi_{\theta}(a_t|s_t) p(s_{t+1}|s_t, a_t)} = \prod_{t=1}^T \frac{\pi_{\theta'}(a_t|s_t)}{\pi_{\theta}(a_t|s_t)}$$

**Critical observation:** Dynamics $p(s_{t+1}|s_t, a_t)$ cancel out! Only policy ratios remain.

### Off-Policy Policy Gradient (Trajectory-Level)

Starting from on-policy gradient with causality and baseline, where $\pi_{\theta'}$ is latest policy:

$$\nabla_{\theta'} J(\theta') = \mathbb{E}_{\tau \sim p_{\theta'}(\tau)} \left[ \left(\sum_{t=1}^T \nabla_{\theta'} \log \pi_{\theta'}(a_t|s_t)\right) \left(\left(\sum_{t'=t}^T r(s_{t'}, a_{t'})\right) - b\right) \right]$$

Apply importance sampling to sample from $\pi_\theta$ instead:

$$\nabla_{\theta'} J(\theta') = \mathbb{E}_{\tau \sim p_{\theta}(\tau)} \left[ \frac{p_{\theta'}(\tau)}{p_{\theta}(\tau)} \left(\sum_{t=1}^T \nabla_{\theta'} \log \pi_{\theta'}(a_t|s_t)\right) \left(\left(\sum_{t'=t}^T r(s_{t'}, a_{t'})\right) - b\right) \right]$$

Substitute the importance weight:

$$\nabla_{\theta'} J(\theta') = \mathbb{E}_{\tau \sim p_{\theta}(\tau)} \left[ \prod_{t=1}^T \frac{\pi_{\theta'}(a_t|s_t)}{\pi_{\theta}(a_t|s_t)} \left(\sum_{t=1}^T \nabla_{\theta'} \log \pi_{\theta'}(a_t|s_t)\right) \left(\left(\sum_{t'=t}^T r(s_{t'}, a_{t'})\right) - b\right) \right]$$

**Problem with trajectory-level IS:** 
- Product $\prod_{t=1}^T \frac{\pi_{\theta'}(a_t|s_t)}{\pi_{\theta}(a_t|s_t)}$ can **explode** or **vanish** for long horizons
- High variance, unstable training

### Off-Policy Policy Gradient (Timestep-Level)

**Better approach:** Apply importance sampling at individual timestep level instead of full trajectory

$$\nabla_{\theta'} J(\theta') \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \frac{\pi_{\theta'}(a_{i,t}|s_{i,t})}{\pi_{\theta}(a_{i,t}|s_{i,t})} \nabla_{\theta'} \log \pi_{\theta'}(a_{i,t}|s_{i,t}) \left(\left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'})\right) - b\right)$$

**Key advantages:**
- Importance weight is now per-timestep: $\frac{\pi_{\theta'}(a_{i,t}|s_{i,t})}{\pi_{\theta}(a_{i,t}|s_{i,t})}$ (single ratio, not product)
- Much less likely to explode/vanish
- More stable variance

**Common simplification:** When $\pi_{\theta'}$ hasn't changed much from $\pi_\theta$, approximate ratio as $\approx 1$:

$$\nabla_{\theta'} J(\theta') \approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_{\theta'} \log \pi_{\theta'}(a_{i,t}|s_{i,t}) \left(\left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'})\right) - b\right)$$

### Off-Policy Algorithm

**Full algorithm:**
1. Sample trajectories $\{\tau^i\}$ from old policy $\pi_\theta(a_t|s_t)$
2. Compute off-policy gradient $\nabla_\theta J(\theta)$ using $\{\tau^i\}$ with importance weights
3. Update: $\theta \leftarrow \theta + \alpha \nabla_\theta J(\theta)$
4. **Key benefit:** Can take **multiple gradient steps** on same batch before resampling

### Policy Constraint Problem

**Issue:** If $\pi_{\theta'}$ drifts too far from $\pi_\theta$ during updates:
- Old data no longer representative of states new policy visits
- Importance weights become inaccurate
- Gradient estimates degrade

**Solution:** Constrain policy updates to keep $\pi_{\theta'}$ close to $\pi_\theta$

**Common constraint (KL divergence):**

$$\mathbb{E}_{s \sim \pi_\theta} [D_{KL}(\pi_{\theta'}(\cdot | s) \| \pi_{\theta}(\cdot | s))] \leq \delta$$

This ensures the new policy doesn't deviate too much from the old one in expectation.

**Methods using this constraint:**
- **TRPO (Trust Region Policy Optimization):** Hard constraint via constrained optimization
- **PPO (Proximal Policy Optimization):** Soft constraint via clipped objective

### Summary: On-Policy vs Off-Policy

| Aspect | On-Policy (Vanilla PG) | Off-Policy (IS) |
|--------|----------------------|----------------|
| **Data source** | Current policy $\pi_{\theta'}$ | Old policy $\pi_\theta$ |
| **Sample efficiency** | Low (discard all data after update) | High (reuse data) |
| **Gradient** | $\mathbb{E}_{\tau \sim \pi_{\theta'}}[\cdots]$ | $\mathbb{E}_{\tau \sim \pi_{\theta}}[\text{IS weight} \cdot \cdots]$ |
| **Variance** | Lower | Higher (due to IS weights) |
| **Updates per batch** | 1 | Multiple |
| **Constraint needed?** | No | Yes (to prevent drift) |

**Key insight:** Off-policy methods trade increased variance (from importance sampling) for dramatically improved sample efficiency (by reusing data).