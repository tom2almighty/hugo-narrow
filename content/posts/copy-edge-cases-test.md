---
title: "复制功能边缘情况测试"
date: 2024-01-16T14:00:00+08:00
draft: false
description: "测试复制功能在各种边缘情况下的表现"
---

# 复制功能边缘情况测试

## 测试 1: 包含多个连续空行

```python {lineNos=true}
def test_multiple_empty_lines():
    print("第一行")
    
    
    # 上面有两个连续空行
    print("第五行")
    
    
    
    # 上面有三个连续空行
    return "完成"
```

**预期复制结果**:
```
def test_multiple_empty_lines():
    print("第一行")
    
    
    # 上面有两个连续空行
    print("第五行")
    
    
    
    # 上面有三个连续空行
    return "完成"
```

## 测试 2: 只有空行的代码块

```text {lineNos=true}



```

**预期复制结果**: 三个空行

## 测试 3: 开头和结尾都有空行

```python {lineNos=true}

def test_leading_trailing_empty():
    print("中间内容")

```

**预期复制结果**:
```

def test_leading_trailing_empty():
    print("中间内容")

```

## 测试 4: 复杂缩进和空行

```python {lineNos=true}
class TestClass:
    def __init__(self):
        self.value = 42
    
    def method_one(self):
        if True:
            print("缩进测试")
            
            # 空行在缩进中
            return True
    
    def method_two(self):
        pass
```

**预期复制结果**:
```
class TestClass:
    def __init__(self):
        self.value = 42
    
    def method_one(self):
        if True:
            print("缩进测试")
            
            # 空行在缩进中
            return True
    
    def method_two(self):
        pass
```

## 测试 5: 单行代码

```python {lineNos=true}
print("单行测试")
```

**预期复制结果**: `print("单行测试")`

## 测试 6: 无行号对比

```python
def no_line_numbers():
    print("无行号")
    
    # 空行测试
    return True
```

**预期复制结果**:
```
def no_line_numbers():
    print("无行号")
    
    # 空行测试
    return True
```

## 测试说明

### 测试重点
1. **多个连续空行** - 确保保留所有原始空行
2. **开头/结尾空行** - 确保不添加或删除边界空行
3. **缩进中的空行** - 确保保留缩进上下文中的空行
4. **单行代码** - 确保不添加多余的换行符
5. **复杂缩进** - 确保保留所有缩进和格式

### 验证方法
1. 点击每个代码块的复制按钮
2. 粘贴到文本编辑器中
3. 对比预期结果
4. 检查是否有多余的空行或缺失的空行

### 常见问题
- **多余空行**: 通常是因为没有正确移除行尾换行符
- **缺失空行**: 通常是因为过度过滤了空内容
- **缩进问题**: 通常是因为没有保留行内的空白字符
