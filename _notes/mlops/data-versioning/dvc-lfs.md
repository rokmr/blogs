---
title: "DVC & Git LFS"
description: "Managing large files, datasets, and model weights in ML projects"
subject: mlops
math: false
tags: [data-versioning, dvc, git, git-lfs, mlops]
status: wip
sitemap: false
order: 1
---

## The Problem
Git is designed for tracking changes in plain text source code. Attempting to commit large binary files (like multi-gigabyte datasets `.csv`, image folders, or model weights `.pt`/`.safetensors`) will drastically bloat the Git repository, making it un-cloneable and violating GitHub's file size limits (usually 100MB).

## Git LFS (Large File Storage)
An official Git extension specifically built to handle large binary files.
- **Mechanism:** When you commit a large file, Git LFS replaces the actual file in the Git history with a tiny text pointer. The actual massive binary file is uploaded to a separate LFS cache/server.
- **Usage:** Run `git lfs track "*.pt"` to ensure all PyTorch models are stored externally.
- **Pros:** Native to GitHub, seamless developer experience (standard `git push` / `git pull` commands work normally).
- **Cons:** Storage and bandwidth costs on GitHub can scale up quickly. Does not natively understand ML pipelines.

## DVC (Data Version Control)
An open-source tool purpose-built for machine learning projects. It makes ML models, data sets, and intermediate files shareable and reproducible.
- **Mechanism:** Similar to Git LFS, it replaces large files with small metadata pointers (`.dvc` files) that are tracked by Git. However, DVC is storage-agnostic. You configure DVC to push the massive files to your own cloud storage bucket (AWS S3, Google Cloud Storage, Azure Blob, or even a local NAS).
- **Pipelines:** DVC is more than just storage; it can track the execution graph. If your pipeline is `Raw Data -> Cleaning Script -> Clean Data -> Training Script -> Model`, DVC tracks the hashes of the inputs and scripts. If you run the pipeline again, DVC knows exactly which steps can be skipped because the inputs haven't changed.
- **Workflow:** 
  1. `dvc add data/dataset.csv`
  2. `git add data/dataset.csv.dvc`
  3. `git commit -m "Add dataset"`
  4. `dvc push` (Pushes binary to S3)
  5. `git push` (Pushes source code and `.dvc` pointer to GitHub)
