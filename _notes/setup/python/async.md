---
title: "AsyncIO & Concurrency"
description: "Python async/await, threads, processes, event loops, and synchronization"
subject: setup
math: false
tags: [setup, python, asyncio, concurrency, parallelism]
---

Run CPU-bound operations while waiting for IO-bound responses.

## Concurrency vs Parallelism
- **Concurrency:** Two lines, one cashier (takes turns). Works well in Python.
- **Parallelism:** Two lines, two cashiers. Faces GIL in Python (single-threaded even with multiple threads).

## Key Concepts

- `async`: Marks function to run concurrently
- `await`: Controls execution order (e.g., waiting for DB response)
- `gather`: Runs functions in parallel

```python
import asyncio
res1, res2 = await asyncio.gather(func1(args1), func2(args2))
```

## When to Use What

- **AsyncIO:** Managing many waiting tasks
- **Threads:** Parallel tasks sharing data with minimal CPU use (IO-bound)
- **Processes:** Maximizing performance on CPU-intensive tasks (runs across multiple cores)

## Core Components

### Event Loop
The core that manages and distributes tasks.

### Coroutines
```python
async def main():
    print("Start of main coroutine")

asyncio.run(main())
```

### Synchronization
- **Lock:** Mutual exclusion
- **Semaphore:** Limited concurrent access
- **Event:** Setter/waiter pattern
