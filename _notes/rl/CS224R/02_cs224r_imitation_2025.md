---
title: "Lec 02 - Imitation Learning"
date: 2025-01-26
description: "Behavioral cloning, DAgger, HG-DAgger, and addressing compounding errors"
tags: [reinforcement-learning, cs224r, imitation-learning, behavioral-cloning]
subject: rl
math: true
slides:
  - title: "Lecture 02 - Imitation Learning"
    url: "/assets/resources/notes/rl/CS224R/02_cs224r_imitation_2025.pdf"
references:
  - title: "Lecture 02 Video"
    url: "https://www.youtube.com/watch?v=WxRDyObrm_M"
    authors: "Chelsea Finn, Sergey Levine"
    venue: "CS224R Stanford"
    year: 2025
  - title: "Lecture 02 Slides"
    url: "https://cs224r.stanford.edu/slides/02_cs224r_imitation_2025.pdf"
    authors: "Chelsea Finn, Sergey Levine"
    venue: "CS224R Stanford"
    year: 2025
---

## Goal of Imitation Learning
Learn a policy $\pi_\theta$ that performs at the expert level by mimicking expert demonstrations.

**Input:** Dataset $\mathcal{D} := \{(s_1, a_1), \ldots, (s_T, a_T)\}$ collected by expert policy $\pi_{expert}$

**Example Application:** Autonomous driving
- Sensor readings + steering commands from human drivers


---

## Behavioral Cloning (BC)

### Version 0: Deterministic Policy

**Algorithm:**
1. Given expert demonstrations $\mathcal{D}$
2. Train policy using supervised regression:
   $$\min_\theta \frac{1}{|\mathcal{D}|} \sum_{(s,a)\in\mathcal{D}} ||a - \hat{a}||^2 \quad \text{where } \hat{a} = \pi_\theta(s)$$
3. Deploy learned policy $\pi_\theta$

**Problem: Fails with Multimodal Data**
- When data collected from multiple experts/people
- Different driving styles (e.g., merge left vs stay straight)
- L2 regression averages behaviors and outputs mean
- Policy learns to "average" contradictory actions (crashes)

**Key Insight:** Happens all the time in practice with multi-human datasets

---

### Version 1: Expressive Policies

**Algorithm:**
1. Given expert demonstrations $\mathcal{D}$
2. Train **generative model** of expert actions:
   $$\min_\theta -\mathbb{E}_{(s,a)\sim\mathcal{D}}[\log \pi_\theta(a|s)]$$
   Maximize log probability of demo actions under the policy
3. Deploy learned policy $\pi_\theta$

**Three Generative Model Approaches:**

1. **Mixture of Gaussians (GMM)**
   - Output: $\mu_1, \sigma_1, w_1, \mu_2, \sigma_2, w_2, \ldots$
   - Can represent multimodal distributions

2. **Discretize + Autoregressive**
   - Output: $p(a_{t,1}), p(a_{t,2} \mid \hat{a}_{t,1}), p(a_{t,3}\mid \hat{a}_{t,1:2}), \cdots$

   - Output: $p(a_{t,1}), p(a_{t,2} \mid \hat{a}_{t,1}), p(a)$
   - Sequential action prediction
   - In cars we can descretize streeing and acceleration
   - depend on the current action so there will be conditional

3. **Diffusion**
   - Iteratively denoise: $s_t, a_t + \sum c_i$
   - $n = N \ldots 1$ denoising steps
   - Output: $\epsilon_n$ (noise estimate)

**Important Note:** Neural network expressivity is often distinct from distribution expressivity

**Empirical Results (Version 1 vs Version 0):**
- Simulated transport task: 
  - Single human collected data: Diffusion (1.0), GMM (0.9) 
  - Multi-human collected data: Diffusion (0.9), GMM (0.4) 
- Real shirt hanging task (multi-human data):
  - Diffusion (0.7) vs L1 (0.25)

---

## Addressing Compounding Errors

### Problem with Pure BC
BC is fully **offline** - learns only from fixed dataset
- Policy errors compound over time
- Agent visits states unseen in training data
- Distribution shift between training and deployment

### Solution: Online Data Collection

---

## DAgger (Dataset Aggregation)

**Algorithm:**
1. Roll out learned policy $\pi_\theta$: $s'_1, \hat{a}_1, \ldots, s'_T$
2. Query expert action at visited states: $a^* \sim \pi_{expert}(\cdot \mid s')$
3. Aggregate corrections with existing data: $\mathcal{D} \leftarrow \mathcal{D} \cup \{(s', a^*)\}$
4. Update policy: $\min_\theta \mathcal{L}(\pi_\theta, \mathcal{D})$

**Advantages:**
- Data-efficient way to learn from expert
- No reward function needed
- Can achieve reliable performance

**Disadvantages:**
- Challenging to query expert when agent has control
- May need impractically large amounts of data

---

## HG-DAgger (Human-Gated DAgger)

**Algorithm:**
1. Start to roll-out learned policy $\pi_\theta$: $s'_1, \hat{a}_1, \ldots, s'_t$
2. Expert **intervenes at time** $t$ when policy makes mistake
3. Expert provides (partial) demonstration: $s'_t, a^*_t, \ldots, s'_T$
4. Aggregate new demos with existing data: $\mathcal{D} \leftarrow \mathcal{D} \cup \{(s'_i, a^*_i)\}$ for $i \geq t$
5. Update policy: $\min_\theta \mathcal{L}(\pi_\theta, \mathcal{D})$

**Key Difference:** Collect corrective behavior data while taking full control

**Advantages:**
- Much more practical interface for providing corrections
- Expert takes control when needed

**Disadvantages:**
- Can be hard to catch mistakes quickly in some domains
- Requires ability to intervene in real-time

**Open Question:** Could you automatically detect when intervention is needed?

---

## Summary Comparison

### Behavioral Cloning (BC) - Offline

**Definition:** Train policy to mimic offline expert demonstrations

**Properties:**
- Best with expressive generative models over actions
- Fully offline algorithm

**Advantages:**
- Simple, no need for online data collection
- Safe (offline data can be verified)
- No reward function needed

**Disadvantages:**
- Doesn't provide framework for self-improvement
- Compounding errors in deployment

---

### DAgger / HG-DAgger - Online

**Definition:** Improve policy using online expert interventions

**Properties:**
- Requires interface for human/expert intervention
- Algorithm runs policy online

**Advantages:**
- Possible path to reliable performance
- More data-efficient than offline BC
- No reward function needed

**Disadvantages:**
- May need impractically large amounts of data for reliable performance
- Requires ability to query expert online
- Safety concerns with online data collection

---

## Key Takeaway

Many successful methods combine imitation learning and reinforcement learning:
- Use BC for initialization
- Use RL for fine-tuning and self-improvement
- Best of both worlds: expert knowledge + autonomous learning

---

**Next:** [Lecture 03 - Policy Gradients](/notes/rl/CS224R/03_cs224r_policy_gradients_2025/) - Learn how to optimize policies directly using gradients