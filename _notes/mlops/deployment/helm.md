---
title: "Helm"
description: "The package manager for Kubernetes to define, install, and upgrade complex applications"
subject: mlops
math: false
tags: [mlops, deployment, helm, kubernetes, packaging]
status: wip
sitemap: false
---

## Overview

Helm is the package manager for Kubernetes. Instead of managing dozens of individual YAML files (Deployments, Services, ConfigMaps), Helm allows you to package them all together into a single unit called a **Chart**. 

## Why use Helm?
- **Templating:** You can use variables (`values.yaml`) to inject configurations dynamically across environments (e.g., changing image tags or resource requests for dev vs. prod).
- **Versioning & Rollbacks:** Helm keeps track of release history, allowing simple `helm rollback` commands if an upgrade fails.
- **Easy Sharing:** You can easily distribute your ML deployment architecture as a single Helm Chart.

TODO: Add `helm template`, `helm install`, and `values.yaml` setup examples.
