---
title: "KaTeX 和 Mermaid 功能测试"
date: 2024-01-16T23:30:00+08:00
draft: false
description: "测试 KaTeX 数学公式和 Mermaid 图表功能"
katex: true
mermaid: true
---

# KaTeX 和 Mermaid 功能测试

这是一个用于测试 KaTeX 数学公式和 Mermaid 图表功能的测试页面。

## 配置说明

### 页面级配置
```yaml
---
katex: true    # 启用 KaTeX
mermaid: true  # 启用 Mermaid
---
```

### 全局配置
```yaml
# hugo.yaml
katex:
  enabled: false  # 全局禁用，但页面可单独启用
  delimiters:     # 支持的分隔符
    - left: "$$"
      right: "$$"
      display: true
    - left: "$"
      right: "$"
      display: false

mermaid:
  enabled: false  # 全局禁用，但页面可单独启用
```

## KaTeX 数学公式测试

### 行内公式
这是一个行内公式：$E = mc^2$，爱因斯坦的质能方程。

另一个例子：当 $a \neq 0$ 时，方程 $ax^2 + bx + c = 0$ 的解为 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。

### 块级公式

#### 二次方程求解公式
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

#### 欧拉公式
$$e^{i\pi} + 1 = 0$$

#### 积分公式
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

#### 矩阵表示
$$\begin{pmatrix} a & b \\\\ c & d \end{pmatrix} \begin{pmatrix} x \\\\ y \end{pmatrix} = \begin{pmatrix} ax + by \\\\ cx + dy \end{pmatrix}$$

#### 求和公式
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

#### 常用数学符号测试
使用预定义宏：$\RR$, $\NN$, $\ZZ$, $\QQ$, $\CC$

## Mermaid 图表测试

### 流程图

```mermaid
flowchart TD
    A[开始] --> B{是否启用?}
    B -->|是| C[加载 Mermaid]
    B -->|否| D[跳过]
    C --> E[查找代码块]
    E --> F[替换为图表]
    F --> G[渲染图表]
    G --> H[完成]
    D --> H
```

### 序列图

```mermaid
sequenceDiagram
    participant U as 用户
    participant B as 浏览器
    participant H as Hugo
    participant M as Mermaid
    
    U->>B: 访问页面
    B->>H: 请求页面
    H-->>B: 返回 HTML
    B->>B: 检查 frontmatter
    alt mermaid: true
        B->>M: 加载 Mermaid
        M->>M: 查找代码块
        M->>M: 替换为图表
        M-->>B: 渲染完成
    else mermaid: false
        B->>B: 跳过加载
    end
    B-->>U: 显示页面
```

### 甘特图

```mermaid
gantt
    title 项目开发计划
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析      :done,    des1, 2024-01-01,2024-01-05
    UI设计        :done,    des2, 2024-01-06,2024-01-10
    原型制作      :active,  des3, 2024-01-11,2024-01-15
    section 开发阶段
    KaTeX开发     :         dev1, 2024-01-16,2024-01-20
    Mermaid开发   :         dev2, 2024-01-18,2024-01-22
    测试阶段      :         test, 2024-01-23,2024-01-25
```




### 饼图

```mermaid
pie title 功能使用统计
    "KaTeX" : 45
    "Mermaid" : 35
    "其他" : 20
```
