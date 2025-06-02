---
title: "简洁代码块折叠功能测试"
date: 2024-01-16T18:00:00+08:00
draft: false
description: "测试简洁的代码块折叠功能"
---

# 简洁代码块折叠功能测试

## 测试 1: 基础折叠功能

### 普通代码块（应该显示折叠按钮）
```python
def hello_world():
    print("Hello, World!")
    return "success"

# 这是一个简单的函数
result = hello_world()
print(result)
```

### 手动设置为折叠状态
```python {collapsed=true}
def collapsed_function():
    """
    这个函数默认应该被折叠
    """
    step1 = "初始化"
    step2 = "处理数据"
    step3 = "验证结果"
    
    print(f"执行步骤: {step1}")
    print(f"执行步骤: {step2}")
    print(f"执行步骤: {step3}")
    
    return "所有步骤完成"
```

### 设置默认状态为折叠
```javascript {defaultState="collapsed"}
function longFunction() {
    // 这个函数默认会被折叠
    const config = {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 3
    };
    
    const data = fetchData(config);
    const processed = processData(data);
    const validated = validateData(processed);
    
    return validated;
}
```

## 测试 2: 长代码块自动折叠

### 超过 30 行的代码块（应该自动折叠）
```python
def very_long_function():
    """
    这是一个超过 30 行的函数，应该会自动折叠
    """
    line_1 = "第一行"
    line_2 = "第二行"
    line_3 = "第三行"
    line_4 = "第四行"
    line_5 = "第五行"
    line_6 = "第六行"
    line_7 = "第七行"
    line_8 = "第八行"
    line_9 = "第九行"
    line_10 = "第十行"
    line_11 = "第十一行"
    line_12 = "第十二行"
    line_13 = "第十三行"
    line_14 = "第十四行"
    line_15 = "第十五行"
    line_16 = "第十六行"
    line_17 = "第十七行"
    line_18 = "第十八行"
    line_19 = "第十九行"
    line_20 = "第二十行"
    line_21 = "第二十一行"
    line_22 = "第二十二行"
    line_23 = "第二十三行"
    line_24 = "第二十四行"
    line_25 = "第二十五行"
    line_26 = "第二十六行"
    line_27 = "第二十七行"
    line_28 = "第二十八行"
    line_29 = "第二十九行"
    line_30 = "第三十行"
    line_31 = "第三十一行"
    line_32 = "第三十二行"
    line_33 = "第三十三行"
    line_34 = "第三十四行"
    line_35 = "第三十五行"
    
    print("这是一个很长的函数")
    return "完成"
```

## 测试 3: 不同语言的代码块

### JavaScript 代码
```javascript
const userManagement = {
    users: [],
    
    addUser(user) {
        this.users.push(user);
        console.log(`用户 ${user.name} 已添加`);
    },
    
    removeUser(userId) {
        this.users = this.users.filter(u => u.id !== userId);
        console.log(`用户 ${userId} 已删除`);
    },
    
    findUser(userId) {
        return this.users.find(u => u.id === userId);
    }
};
```

### CSS 代码
```css
.code-block-container {
    margin: 1.5rem 0;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    overflow: hidden;
    background: var(--card-background);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.code-block-container:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}
```

## 功能测试清单

### ✅ 基础功能
- [ ] 折叠按钮显示正确
- [ ] 点击折叠按钮可以切换状态
- [ ] 折叠状态下显示渐变遮罩和提示
- [ ] 展开状态下显示完整代码
- [ ] 按钮图标和文字正确更新

### ✅ 配置功能
- [ ] `collapsed=true` 参数生效
- [ ] `defaultState="collapsed"` 参数生效
- [ ] 全局配置生效
- [ ] 自动折叠功能正常

### ✅ 用户体验
- [ ] 折叠/展开动画流畅
- [ ] 点击遮罩可以展开
- [ ] 复制功能不受影响
- [ ] 响应式设计适配

### ✅ 兼容性
- [ ] 与现有样式兼容
- [ ] 与行号功能兼容
- [ ] 与语法高亮兼容
- [ ] 多语言支持正确

## 使用说明

### 基础用法
```markdown
# 普通代码块（会显示折叠按钮）
```python
def example():
    pass
```

# 默认折叠的代码块
```python {collapsed=true}
def example():
    pass
```

# 设置默认状态
```python {defaultState="collapsed"}
def example():
    pass
```
```

### 配置选项
- `collapsed=true` - 强制折叠
- `defaultState="collapsed"` - 设置默认状态为折叠
- 全局配置在 `hugo.yaml` 中设置

### 自动折叠
- 超过 30 行的代码块会自动折叠
- 超过 400px 高度的代码块会自动折叠
- 可在配置中调整阈值
