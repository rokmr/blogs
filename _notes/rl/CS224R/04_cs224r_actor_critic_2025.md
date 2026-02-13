---
title: "Lec 04 - Actor-Critic"
date: 2025-01-26
description: "Value functions, advantage estimation, actor-critic algorithm, bootstrapping"
tags: [reinforcement-learning, cs224r, actor-critic, value-function]
subject: rl
math: true
---

# Actor-Critic Method

Basis for PPO (LM model training)

- Value Function $V^{\pi}(s)$: future expected rewards starting at $s$ and following $\pi$
$$V^{\pi}(s_t) = \sum_{t'= t} \mathbb{E}_{s_{t'}, a_{t'} \sim \pi} \left[  r(s_{t'}, a_{t'}) | s_t \right]$$

here, $a_t$ is future action sampled from $\pi$

- Q - Funciton $Q^{\pi}(s,a)$: future expected rewards starting at $s$, taking $a$ and then following $\pi$

$$Q^{\pi}(s_t, a_t)= \sum_{t'= t} \mathbb{E}_{\pi}\left[  r(s_{t'}, a_{t'}) | s_t, a_t \right]$$


here, take a specific action $a_t$ at​ first (which might not be from $\pi$), then follow $\pi$ for all subsequent actions.

$$V^{\pi}(s) = \mathbb{E}_{a \sim \pi(\cdot|s_t)} \left[Q^{\pi}(s,a)\right]$$

- Advantage $A^{\pi}(s,a)$: how much better it is to take $a$ than to follow $\pi$ at state $s$

$$A^{\pi}(s,a) = Q^{\pi}(s,a) - V^{\pi}(s_t)$$


## Improving policy gradient


Estimating **reward to go**: estimate of future rewards if we take $a_{i, t'}$ in state $s_{i, t'}$

$r(\tau) = \sum_{t' = t} r(s_{i, t'}, a_{i, t'})$ 

Instead of summing all the rewards together, we can run the policy many times and then get Q-funtion which will be true expected rewards to go

$\sum_{t'=t} \mathbb{E}_{\pi_{\theta}} \left[ r(s_{t'}, a_{t'}) | s_{t}, a_{t} \right] = Q(s_{t}, a_{t})$

Therefore, 
$$\nabla_\theta J(\theta) 
\approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'}) - b\right)$$

$$\nabla_\theta J(\theta) 
\approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) \left(Q(s_{i,t'}, a_{i,t'}) - V^{\pi}(s_t)\right)$$

where, $b = \frac{1}{N} \sum_i Q(s_{i,t}, a_{i,t})$ which is eqivalent to $V^{\pi}(s_t)$

$$\nabla_\theta J(\theta) 
\approx \frac{1}{N} \sum_{i=1}^N \sum_{t=1}^T \nabla_\theta \log \pi_\theta(a_{i,t}|s_{i,t}) A^{\pi}(s_{i,t'}, a_{i,t'})$$

This is unbiased estimates

Better estimates of $A$ lead to less noisy gradients!

### Algorithm
Initialize the policy (randomly, with imitation learning, with heuristics)

Do till convergence:
    
1. Run policy to collect batch of data
2. Fit model to estimate expected return: Estimate $V^{\pi}, Q^{\pi} or A^{\pi}$
3. Improve policy: $\theta \leftarrow \theta + \nabla_{\theta}J(\theta)$

## Estimate Expected Return

- $A^{\pi}(s_t,a_t) = Q^{\pi}(s_t,a_t) - V^{\pi}(s_t)$

- $A^{\pi}(s_t,a_t) \approx r(s_t, a_t) + V^{\pi}(s_{t+1}) - V^{\pi}(s_t)$

This lets us only train for $V^{\pi}$ using neural network $(\phi)$ whose output will be scalr value


**Derivation**

$
\begin{aligned}
Q^{\pi}(s_t, a_t) &= \sum_{t'=t}^{T} E_{\pi_{\theta}} \left[ r(s_{t'}, a_{t'}) | s_t, a_t \right] \\
&= r(s_t, a_t) + \sum_{t'=t+1}^{T} E_{\pi_{\theta}} \left[ r(s_{t'}, a_{t'}) | s_t, a_t \right] \\
&= r(s_t, a_t) + E_{s_{t+1} \sim p(\cdot | s_t, a_t)} \left[ V^{\pi}(s_{t+1}) \right] \\
&\approx r(s_t, a_t) + V^{\pi}(s_{t+1}) \quad \text{(using single sample estimate)}
\end{aligned}  
$

$Q^{\pi}s_t,(a_t)$ : Reward at current time step + expected value after that time step



## Estimating $V^{\pi}$

### Single Sample vs Monte Carlo Estimates

**Single trajectory estimate:**
$$V^{\pi}(s_t) \approx \sum_{t'=t}^{T} r(s_{t'}, a_{t'}) \quad \text{(single trajectory estimate)}$$

**Monte Carlo estimate (true averaging):**
$$V^{\pi}(s_t) \approx \frac{1}{N} \sum_{i=1}^{N} \sum_{t'=t}^{T} r(s_{t'}, a_{t'}) \quad \text{(requires resetting to } s_t \text{ for } N \text{ trajectories; often impractical)}$$

where $s_{i,t}$ denotes state at timestep $t$ in trajectory $i$.

---

### Practical Approach: Function Approximation

Since resetting to the same state multiple times is impractical, we use function approximation instead:

**Step 1: Aggregate dataset of single sample estimates**

Run $N$ trajectories. For each state-timestep pair encountered, compute the return (sum of future rewards):
$$y_{i,t} = \sum_{t'=t}^{T} r(s_{i,t'}, a_{i,t'})$$

This gives us dataset: $\{(s_{i,t}, y_{i,t})\}$ containing many state-return pairs from different states.

**Step 2: Supervised learning to fit value function**

Train a neural network $\hat{V}_{\phi}^{\pi}$ to predict returns by minimizing:
$$\mathcal{L}(\phi) = \frac{1}{2} \sum_{i,t} \left\| \hat{V}_{\phi}^{\pi}(s_{i,t}) - y_{i,t} \right\|^2$$

**Key Insight:** Each training sample $(s_{i,t}, y_{i,t})$ uses a single noisy estimate, but the neural network learns to generalize across many states and effectively "averages out" the noise. This avoids needing to visit the same state multiple times.


### Version 2: Bootstrapping (Temporal Difference Learning)

**Monte Carlo target:**
$$y_{i,t} = \sum_{t'=t}^{T} E_{\pi_{\theta}} \left[ r(s_{t'}, a_{t'}) | s_i, a_i \right]$$

**Ideal target (Bellman equation):**
$$y_{i,t} = r(s_{i,t}, a_{i,t}) + \sum_{t'=t+1}^{T} E_{\pi_{\theta}} \left[ r(s_{t'}, a_{t'}) | s_{i,t+1} \right] \approx r(s_{i,t}, a_{i,t}) + V^{\pi}(s_{i,t+1})$$

**Bootstrapped target (using fitted value):**
$$y_{i,t} = r(s_{i,t}, a_{i,t}) + \hat{V}_{\phi}^{\pi}(s_{i,t+1})$$

**Step 1: Aggregate dataset of "bootstrapped" estimates**

Training data: $\left\{ \left( s_{i,t}, \underbrace{r(s_{i,t}, a_{i,t}) + \hat{V}_{\phi}^{\pi}(s_{i,t+1})}_{y_{i,t}} \right) \right\}$

**Important:** Update labels $y_{i,t}$ every gradient update!

**Step 2: Supervised learning**

$$\mathcal{L}(\phi) = \frac{1}{2} \sum_{i} \left\| \hat{V}_{\phi}^{\pi}(s_i) - y_i \right\|^2$$

Also called **temporal difference (TD) learning**.

---

### Comparison: Monte Carlo vs. Bootstrap

| Method | Target | Variance | Description |
|--------|--------|----------|-------------|
| **Monte Carlo** | $y_{i,t} = \sum_{t'=t}^{T} r(s_{i,t'}, a_{i,t'})$ | **Very high** | Supervise with roll-out's summed rewards |
| **Bootstrap/TD** | $y_{i,t} = r(s_{i,t}, a_{i,t}) + \hat{V}_{\phi}^{\pi}(s_{i,t+1})$ | **Much lower** | Supervise using reward + value estimate |

**Key difference:**
- **MC**: Very high variance (sums many random rewards)
- **Bootstrap (TD)**: Much lower variance (only one reward + value estimate)

**Example:** Trajectory with mostly $r=0$, then $r=-1$ or $r=1$ at some point - MC has high variance, TD has lower variance.

---

### Example: MC vs TD Estimates

**TODO: Add diagram image**

**Scenario:** From state $s$, two possible outcomes:
- Branch 1: Get $r=-1$ then $r=1$ → total return = 0
- Branch 2: Get $r=1$ then $r=-1$ → total return = 0
- Trajectory has $r=0$ everywhere else

**Analysis:**

Starting from state $s$ (blue):

**Monte Carlo estimates:**
- $\hat{V}_{MC}^{\pi}(s)$: If we take the branch that goes left (red $r=-1$), MC return = $-1 + 0 + 0 + ... = -1$ (high variance)
- If we take the branch that goes right (green $r=1$), MC return = $1 + 0 + 0 + ... = 1$ (high variance)
- True value: $V^{\pi}(s) = 0$ (average of both paths)

**TD estimates:**
- $\hat{V}_{TD}^{\pi}(s)$: Uses $r + \hat{V}(s_{next})$
- After seeing both branches a few times, $\hat{V}(s_{next})$ learns to predict 0
- TD estimate converges faster to true value with lower variance

**Key insight:** TD can learn from incomplete episodes and has lower variance because it uses the value function to "fill in" future rewards.

---

### N-Step Returns: Middle Ground Between MC and TD

**Motivation:** Instead of using just one reward (TD) or all rewards (MC), we can use the next $n$ rewards and then bootstrap from the value estimate at $t+n$.

**N-step return formula:**
$$y_{i,t} = \sum_{t'=t}^{t+n-1} r(s_{i,t'}, a_{i,t'}) + \hat{V}_{\phi}^{\pi}(s_{i,t+n})$$

**Comparison:**

| Method | Formula | Variance | Bias |
|--------|---------|----------|------|
| **Monte Carlo** ($n = T-t$) | $\sum_{t'=t}^{T} r(s_{i,t'}, a_{i,t'})$ | Very high | None (unbiased) |
| **N-step returns** ($1 < n < T$) | $\sum_{t'=t}^{t+n-1} r(s_{i,t'}, a_{i,t'}) + \hat{V}_{\phi}^{\pi}(s_{i,t+n})$ | Medium | Medium |
| **1-step Bootstrap/TD** ($n = 1$) | $r(s_{i,t}, a_{i,t}) + \hat{V}_{\phi}^{\pi}(s_{i,t+1})$ | Much lower | Highest |

**N-step returns = Middle ground between MC and TD**

**In practice:** $n > 1, n < T$ often works best!

---

## Aside: Discount Factor $\gamma$

**Problem:** If $T = \infty$, $\hat{V}_{\phi}^{\pi}$ can become infinitely large.

**Solution:** Use discount factor $\gamma \in [0, 1]$ (typically 0.99):

$$y_{i,t} \approx r(s_{i,t}, a_{i,t}) + \gamma \hat{V}_{\phi}^{\pi}(s_{i,t+1})$$

### Interpretation of $\gamma$

**$\gamma = 0.99$ means:**
- The agent has a 1% probability per timestep that it will get stuck and stay in a terminal state forever
- Equivalently: $(1 - \gamma) = 0.01$ probability of episode ending at each step

**Mathematically:** $\gamma$ modifies the MDP dynamics:
- $\tilde{p}(s'|s,a) = \gamma p(s'|s,a)$ for non-terminal states
- $\tilde{p}(\text{terminal}|s,a) = 1-\gamma$

### Choosing $\gamma$

**Rule of thumb:**
- If variance increases slowly over time → use larger $\gamma$ (e.g., 0.99, 0.995)
- If variance increases quickly → use smaller $\gamma$ (e.g., 0.95, 0.9)

**Why?** Larger $\gamma$ means we care more about distant future rewards, which increases variance. If rewards are already highly variable, a smaller $\gamma$ helps reduce this variance.

**General N-step form with discount:**
$$y_{i,t} = \sum_{t'=t}^{t+n-1} \gamma^{t'-t} r(s_{i,t'}, a_{i,t'}) + \gamma^n \hat{V}_{\phi}^{\pi}(s_{i,t+n})$$

---

## Actor-Critic Algorithm

### Full Algorithm

1. Sample batch of data $\{(s_{1,i}, a_{1,i}, ..., s_{T,i}, a_{T,i})\}$ from $\pi_{\theta}$

2. Fit $\hat{V}_{\phi}^{\pi_{\theta}}$ to returns:
   $$\mathcal{L}(\phi) = \frac{1}{2} \sum_{i} \left\| \hat{V}_{\phi}^{\pi}(s_i) - y_i \right\|^2$$
   
   where $y_{i,t} = \sum_{t'=t}^{t+n-1} \gamma^{t'-t} r(s_{i,t'}, a_{i,t'}) + \gamma^n \hat{V}_{\phi}^{\pi}(s_{i,t+n})$

3. Evaluate advantage: 
   $$\hat{A}^{\pi_{\theta}}(s_{t,i}, a_{t,i}) = r(s_{t,i}, a_{t,i}) + \gamma \hat{V}_{\phi}^{\pi_{\theta}}(s_{t+1,i}) - \hat{V}_{\phi}^{\pi_{\theta}}(s_{t,i})$$

4. Evaluate policy gradient:
   $$\nabla_{\theta} J(\theta) \approx \sum_{t,i} \nabla_{\theta} \log \pi_{\theta}(a_{t,i} | s_{t,i}) \hat{A}^{\pi_{\theta}}(s_{t,i}, a_{t,i})$$

5. Update policy: $\theta \leftarrow \theta + \alpha \nabla_{\theta} J(\theta)$

**Architecture:**
- **Actor**: $\pi_{\theta}(a|s)$ outputs action probabilities
- **Critic**: $\hat{V}_{\phi}^{\pi}(s)$ estimates state values

---

## Summary: Policy Evaluation Methods

**Three approaches:**

1. **Monte Carlo:** Supervised learning on sum of future rewards
   - Very high variance, unbiased

2. **Bootstrapping (1-step TD):** Supervised learning on reward + next state value
   - Much lower variance, biased

3. **N-step returns:** Sum of next $n$ rewards + value after that
   - Middle ground: balanced variance and bias

---

## Off-Policy Actor-Critic

### Version 1: Multiple Gradient Steps

Reuse collected data for multiple gradient updates. Same algorithm as above, but:

4. In policy gradient step: **use importance weights** to correct for distribution mismatch

**Note:** When policy changes after multiple updates, data is off-policy. Importance sampling corrects this, leading to algorithms like PPO, TRPO, SAC.
Now includes: