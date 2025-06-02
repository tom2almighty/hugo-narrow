---
title: "行号结构测试"
date: 2024-01-16T12:00:00+08:00
draft: false
description: "测试内联行号的 HTML 结构"
---

# 行号结构测试

## 带内联行号的代码块

```python {lineNos=true}
def test_function():
    print("line 1")
    print("line 2")
    return True
```

## 包含空行的代码块测试

```python {lineNos=true}
def test_with_empty_lines():
    print("第一行")

    # 上面有一个空行
    print("第三行")

    # 下面还有一个空行

    return "测试完成"
```

## 不带行号的代码块

```python
def test_function():
    print("line 1")
    print("line 2")
    return True
```

## 复制测试说明

### 带行号的代码块复制测试

#### 基础测试
点击第一个带行号代码块的复制按钮，应该复制以下内容（不包含行号）：
```
def test_function():
    print("line 1")
    print("line 2")
    return True
```

#### 空行测试
点击包含空行的代码块复制按钮，应该复制以下内容（保留空行，不包含行号）：
```
def test_with_empty_lines():
    print("第一行")

    # 上面有一个空行
    print("第三行")

    # 下面还有一个空行

    return "测试完成"
```

**重要**: 复制的内容应该保留原始的空行，但不应该有多余的空行。

### 技术细节
- **行号类名**: `.ln`
- **代码类名**: `.cl`
- **复制策略**: 只选择 `.cl` 元素的文本内容
- **HTML 结构**: `<span class="line"><span class="ln">1</span><span class="cl">代码</span></span>`
