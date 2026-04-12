---
title: "CI/CD"
description: "Continuous Integration and Deployment pipelines for ML"
subject: mlops
math: false
tags: [mlops, cicd, deployment, pipelines]
---

## Continuous Deployment Pipeline

GitHub repo → Dev env → QA env → UAT env → Production

## Developer Workflow

1. Feature Development
2. Push and Pull Request (PR)
3. Automated CI Pipeline — build + run tests; if passes, merge to main
4. Continuous Deployment — deploy to staging after merge

## Key Stages

- **Linting:** Enforces coding standards, catches errors early
- **Unit Tests:** Check code at component level, fast running
- **Build:** Compile into artifacts (executables, archives, container images)
- **Test:** Automated testing improves deployment speed
