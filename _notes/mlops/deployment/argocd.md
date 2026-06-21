---
title: "ArgoCD"
description: "Declarative, GitOps continuous delivery tool for Kubernetes"
subject: mlops
math: false
tags: [mlops, deployment, argocd, kubernetes, gitops, ci-cd]
status: wip
sitemap: false
---

## Overview

ArgoCD is a declarative, GitOps continuous delivery tool specifically built for Kubernetes. It continuously monitors running applications and compares their live, in-cluster state against the desired state defined in a Git repository.

## The GitOps Paradigm
In traditional CI/CD, pipelines *push* changes to a cluster. With ArgoCD and GitOps, the cluster *pulls* changes from Git. Git becomes the single source of truth for the entire infrastructure.

## Key Features
- **Drift Detection:** If someone manually edits a resource via `kubectl`, ArgoCD detects the configuration drift and can automatically sync it back to match Git.
- **Visual Dashboard:** Provides a clear UI to visualize the health and sync status of all Kubernetes resources.
- **Rollbacks:** Instantly revert to a previous Git commit if a deployment fails.

TODO: Add Helm/Kustomize integration examples and ArgoCD CLI setup.
