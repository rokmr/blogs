---
title: "BiRefNet"
description: "Bilateral Reference for High-Resolution Dichotomous Image Segmentation"
subject: cv
math: true
tags: [cv, segmentation, birefnet, swin-transformer, dichotomous]
paper: "https://arxiv.org/pdf/2401.03407"
---

![BiRefNet Comparison]({{ "/assets/img/notes/cv/segmentation/BiRefNetComparison.png" | relative_url }})

Bilateral Reference for High-Resolution Dichotomous Image Segmentation. Swin-Transformer based with inward reference (InRef) and outward reference (OutRef).

![BiRefNet Architecture]({{ "/assets/img/notes/cv/segmentation/BiRefNet.png" | relative_url }})

## Two Essential Modules

### Localization Module (LM)

- Transformer Encoder extracts features at different stages: $F_1^e, F_2^e, F_3^e$ with resolution at 4, 8, 16, 32
- First four features $\{F_i^e\}_{i=1}^3$ are transferred to corresponding decoder stages with lateral connections (1×1 convolution layers)
- Features are stacked and concatenated in the last encoder block to generate $F^e$, then fed into a classification module
- Uses [Atrous Spatial Pyramid Pooling (ASPP)](https://openaccess.thecvf.com/content_ECCV_2018/papers/Liang-Chieh_Chen_Encoder-Decoder_with_Atrous_ECCV_2018_paper.pdf) for multi-context fusion

### Reconstruction Module (RM)

- Small receptive fields (RFs) lead to inadequate context; large RFs result in insufficient detail extraction
- Uses reconstruction block (RB) in each **BiRef** block as replacement for vanilla residual blocks
- Employs [deformable convolutions](https://openaccess.thecvf.com/content_ICCV_2017/papers/Dai_Deformable_Convolutional_Networks_ICCV_2017_paper.pdf) with hierarchical RFs (1×1, 3×3, 7×7) and adaptive average pooling
- Features extracted by different RFs are concatenated as $F_i^{\theta}$, followed by 1×1 conv + batch norm → output $F_i^{d'}$

## Bilateral Reference

![Bilateral Reference Block]({{ "/assets/img/notes/cv/segmentation/BiRefNetBlock.png" | relative_url }})

- **InRef (Inward Reference):** Images $I$ with original high resolution are cropped to patches $\{P_k\}_{k=1}^N$ of consistent size with decoder stage output. Patches are stacked with original feature $F_i^{d+}$ and fed into RM.
- **OutRef (Outward Reference):** Gradient maps $G_i^{gt}$ draw attention to areas of richer gradient information. $F_i^{\theta}$ generates $F_i^G$ → predicted gradient maps $\hat{G}^i$ → gradient attention $A_i^G$ → multiplied by $F_i^{d'}$ → output $F_{i-1}^d$.

## Loss

$$L = L_{pixel} + L_{region} + L_{boundary} + L_{semantic} = \lambda_1 L_{BCE} + \lambda_2 L_{IoU} + \lambda_3 L_{SSIM} + \lambda_4 L_{CE}$$

$$L_{BCE} = -\sum_{(i,j)} [G(i,j) \log(M(i,j)) + (1-G(i,j)) \log(1-M(i,j))]$$

$$L_{IoU} = 1 - \frac{\sum_{r=1}^H \sum_{c=1}^W M(i,j)G(i,j)}{\sum_{r=1}^H \sum_{c=1}^W [M(i,j)+G(i,j)-M(i,j)G(i,j)]}$$

$$L_{SSIM} = 1 - \frac{(2\mu_x\mu_y + C_1)(2\sigma_{xy} + C_2)}{(\mu_x^2 + \mu_y^2 + C_1)(\sigma_x^2 + \sigma_y^2 + C_2)}$$
