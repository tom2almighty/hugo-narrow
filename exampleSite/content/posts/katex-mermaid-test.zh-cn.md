---
title: "KaTeX 和 Mermaid 测试"
date: 2024-01-17T10:00:00+08:00
draft: false
description: "测试 KaTeX 数学公式和 Mermaid 图表渲染功能"
tags: ["测试", "katex", "mermaid", "数学", "图表"]
categories: ["数学图表"]
slug: katex-mermaid-test
katex: true
mermaid: true
---

# KaTeX 和 Mermaid 测试

本文用于测试 KaTeX 数学公式渲染和 Mermaid 图表功能。

## Mermaid 图表测试

### 流程图

```mermaid
graph TD
    A[开始] --> B{是否为用户？}
    B -->|是| C[显示用户界面]
    B -->|否| D[显示登录页面]
    C --> E[用户操作]
    D --> F[用户登录]
    F --> G{登录成功？}
    G -->|是| C
    G -->|否| H[显示错误信息]
    H --> D
    E --> I[结束]
```

### 序列图

```mermaid
sequenceDiagram
    participant 用户
    participant 浏览器
    participant 服务器
    participant 数据库

    用户->>浏览器: 输入网址
    浏览器->>服务器: 发送HTTP请求
    服务器->>数据库: 查询数据
    数据库-->>服务器: 返回数据
    服务器-->>浏览器: 返回HTML
    浏览器-->>用户: 显示页面
```

### 甘特图

```mermaid
gantt
    title 项目开发时间线
    dateFormat  YYYY-MM-DD
    section 设计阶段
    需求分析           :done,    des1, 2024-01-01,2024-01-05
    UI设计            :done,    des2, 2024-01-06, 2024-01-12
    原型制作           :active,  des3, 2024-01-13, 2024-01-18
    section 开发阶段
    前端开发           :         dev1, 2024-01-19, 2024-02-15
    后端开发           :         dev2, 2024-01-19, 2024-02-20
    数据库设计         :         dev3, 2024-01-19, 2024-01-25
    section 测试阶段
    单元测试           :         test1, 2024-02-16, 2024-02-25
    集成测试           :         test2, 2024-02-21, 2024-03-01
    用户测试           :         test3, 2024-02-26, 2024-03-05
```


## KaTeX 测试

### 行内公式

这是一个行内公式：$E = mc^2$，爱因斯坦的质能等价公式。

另一个例子：当 $a \neq 0$ 时，二次方程 $ax^2 + bx + c = 0$ 的解为 $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$。

### 块级公式
#### 二次公式
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

#### 欧拉公式
$$e^{i\pi} + 1 = 0$$

#### 积分公式
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

#### 矩阵表示
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

#### 求和公式
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

#### 微分方程
$$\frac{d^2y}{dx^2} + \omega^2 y = 0$$

#### 傅里叶变换
$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt$$

#### 泰勒级数
$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### 复杂数学表达式

#### 概率密度函数
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

#### 麦克斯韦方程组
$$\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{align}$$

#### 薛定谔方程
$$i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)$$

## 组合测试

### 带公式的流程图

```mermaid
graph LR
    A["输入: $f(x) = ax^2 + bx + c$"] --> B["计算判别式: $\Delta = b^2 - 4ac$"]
    B --> C{"$\Delta > 0$?"}
    C -->|是| D["两个实根: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$"]
    C -->|否| E{"$\Delta = 0$?"}
    E -->|是| F["一个实根: $x = \frac{-b}{2a}$"]
    E -->|否| G["无实根"]
```

### 数学概念解释

在数学中，**黄金比例** $\phi$ 定义为：

$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$$

它满足以下性质：

$$\phi^2 = \phi + 1$$

这个比例在自然界和艺术中都有广泛应用。

---

这个测试页面展示了 KaTeX 和 Mermaid 的各种功能，包括复杂的数学公式和多种类型的图表。
