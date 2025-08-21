---
title: "KaTeX and Mermaid Test"
date: 2024-01-16T23:30:00+08:00
draft: false
description: "Testing KaTeX and Mermaid features"
katex: true
mermaid: true
tags: ['Math', 'Mermaid']
---

# KaTeX and Mermaid Test

This article is used to test the KaTeX and Mermaid features.

## Configuration

### Frontmatter Configuration
```yaml
---
katex: true
mermaid: true
---
```

### Global Configuration
```yaml
# hugo.yaml
katex:
  enabled: true
  delimiters: 
    - left: "$$"
      right: "$$"
      display: true
    - left: "$"
      right: "$"
      display: false

mermaid:
  enabled: true
```

## KaTeX Test

### Inline Formula

This is an inline formula: $E = mc^2$, Einstein's mass-energy equivalence formula.

Another example：When $a \neq 0$, the solutions to the quadratic equation $ax^2 + bx + c = 0$ are $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$.

### Block Formula
#### Quadratic Formula
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

#### Euler's Formula
$$e^{i\pi} + 1 = 0$$

#### Integral Formula
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

#### Matrix Representation
$$\begin{pmatrix} a & b \\\\ c & d \end{pmatrix} \begin{pmatrix} x \\\\ y \end{pmatrix} = \begin{pmatrix} ax + by \\\\ cx + dy \end{pmatrix}$$

#### Summation Formula
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

#### Common Mathematical Symbols Test
Using predefined macros: $\RR$, $\NN$, $\ZZ$, $\QQ$, $\CC$
