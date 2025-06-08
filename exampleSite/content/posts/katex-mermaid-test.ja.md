---
title: "KaTeXとMermaidテスト"
date: 2024-01-17T10:00:00+08:00
draft: false
description: "KaTeX数式とMermaidチャートレンダリング機能のテスト"
tags: ["テスト", "katex", "mermaid", "数学", "チャート"]
categories: ["数学チャート"]
slug: katex-mermaid-test
katex: true
mermaid: true
---

# KaTeXとMermaidテスト

この記事はKaTeX数式レンダリングとMermaidチャート機能をテストするために使用されます。

## Mermaidチャートテスト

### フローチャート

```mermaid
graph TD
    A[開始] --> B{ユーザーですか？}
    B -->|はい| C[ユーザーインターフェースを表示]
    B -->|いいえ| D[ログインページを表示]
    C --> E[ユーザー操作]
    D --> F[ユーザーログイン]
    F --> G{ログイン成功？}
    G -->|はい| C
    G -->|いいえ| H[エラーメッセージを表示]
    H --> D
    E --> I[終了]
```

### シーケンス図

```mermaid
sequenceDiagram
    participant ユーザー
    participant ブラウザ
    participant サーバー
    participant データベース

    ユーザー->>ブラウザ: URLを入力
    ブラウザ->>サーバー: HTTPリクエストを送信
    サーバー->>データベース: データを照会
    データベース-->>サーバー: データを返す
    サーバー-->>ブラウザ: HTMLを返す
    ブラウザ-->>ユーザー: ページを表示
```

### ガントチャート

```mermaid
gantt
    title プロジェクト開発タイムライン
    dateFormat  YYYY-MM-DD
    section 設計段階
    要件分析           :done,    des1, 2024-01-01,2024-01-05
    UI設計            :done,    des2, 2024-01-06, 2024-01-12
    プロトタイプ作成    :active,  des3, 2024-01-13, 2024-01-18
    section 開発段階
    フロントエンド開発  :         dev1, 2024-01-19, 2024-02-15
    バックエンド開発    :         dev2, 2024-01-19, 2024-02-20
    データベース設計    :         dev3, 2024-01-19, 2024-01-25
    section テスト段階
    単体テスト         :         test1, 2024-02-16, 2024-02-25
    統合テスト         :         test2, 2024-02-21, 2024-03-01
    ユーザーテスト     :         test3, 2024-02-26, 2024-03-05
```


## KaTeXテスト

### インライン数式

これはインライン数式です：$E = mc^2$、アインシュタインの質量エネルギー等価式。

別の例：$a \neq 0$ のとき、二次方程式 $ax^2 + bx + c = 0$ の解は $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$ です。

### ブロック数式
#### 二次公式
$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

#### オイラーの公式
$$e^{i\pi} + 1 = 0$$

#### 積分公式
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$

#### 行列表現
$$\begin{pmatrix} a & b \\ c & d \end{pmatrix} \begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} ax + by \\ cx + dy \end{pmatrix}$$

#### 総和公式
$$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$$

#### 微分方程式
$$\frac{d^2y}{dx^2} + \omega^2 y = 0$$

#### フーリエ変換
$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt$$

#### テイラー級数
$$f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### 複雑な数学表現

#### 確率密度関数
$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}$$

#### マクスウェル方程式
$$\begin{align}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\epsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{align}$$

#### シュレーディンガー方程式
$$i\hbar\frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)$$

## 組み合わせテスト

### 数式付きフローチャート

```mermaid
graph LR
    A["入力: $f(x) = ax^2 + bx + c$"] --> B["判別式を計算: $\Delta = b^2 - 4ac$"]
    B --> C{"$\Delta > 0$?"}
    C -->|はい| D["2つの実根: $x = \frac{-b \pm \sqrt{\Delta}}{2a}$"]
    C -->|いいえ| E{"$\Delta = 0$?"}
    E -->|はい| F["1つの実根: $x = \frac{-b}{2a}$"]
    E -->|いいえ| G["実根なし"]
```

### 数学概念の説明

数学において、**黄金比** $\phi$ は次のように定義されます：

$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$$

これは以下の性質を満たします：

$$\phi^2 = \phi + 1$$

この比率は自然界と芸術の両方で広く応用されています。

---

このテストページはKaTeXとMermaidの様々な機能を示しており、複雑な数学式と複数種類のチャートが含まれています。
