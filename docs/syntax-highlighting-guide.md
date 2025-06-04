# 语法高亮主题自定义指南

## 概述

Hugo Narrow 主题使用基于 CSS 变量的语法高亮系统，你可以通过 Hugo 的 `chromastyles` 命令生成任何主题，然后简单地替换颜色变量即可。

## 当前实现分析

### 🎯 **优势**
- ✅ **基于 CSS 变量** - 所有颜色都通过 `--chroma-*` 变量定义
- ✅ **主题系统集成** - 代码块背景使用 `var(--color-card)` 等主题变量
- ✅ **亮色/暗色模式** - 分别定义 `:root:not(.dark)` 和 `.dark` 下的变量
- ✅ **完整覆盖** - 支持所有 Chroma 语法元素
- ✅ **回退机制** - 每个变量都有合理的回退值

### 📁 **文件结构**
```
assets/css/syntax-highlighting.css  # 语法高亮样式文件
├── CSS 变量定义 (第 4-111 行)
├── Chroma 样式应用 (第 113-339 行)
└── 主题变量集成
```

## 快速自定义方法

### 🚀 **方法一：直接替换颜色变量（推荐）**

1. **生成新主题样式**：
```bash
# 生成你想要的主题
hugo gen chromastyles --style=dracula > temp-dracula.css
hugo gen chromastyles --style=monokai > temp-monokai.css
```

2. **提取颜色值**：
从生成的文件中找到颜色值，例如：
```css
/* 从 temp-dracula.css 中提取 */
.chroma .k { color: #ff79c6; }  /* 关键字颜色 */
.chroma .s { color: #f1fa8c; }  /* 字符串颜色 */
.chroma .c { color: #6272a4; }  /* 注释颜色 */
```

3. **更新 CSS 变量**：
在 `assets/css/syntax-highlighting.css` 中更新对应的变量：

```css
/* 更新亮色模式变量 */
:root:not(.dark) {
  --chroma-k: #d73a49;    /* 关键字 -> 替换为你想要的颜色 */
  --chroma-s: #032f62;    /* 字符串 -> 替换为你想要的颜色 */
  --chroma-c: #6a737d;    /* 注释 -> 替换为你想要的颜色 */
  /* ... 更多变量 */
}

/* 更新暗色模式变量 */
.dark {
  --chroma-k: #ff79c6;    /* 关键字 -> 替换为 Dracula 的颜色 */
  --chroma-s: #f1fa8c;    /* 字符串 -> 替换为 Dracula 的颜色 */
  --chroma-c: #6272a4;    /* 注释 -> 替换为 Dracula 的颜色 */
  /* ... 更多变量 */
}
```

### 🎨 **方法二：完整替换主题**

1. **生成完整的亮色和暗色主题**：
```bash
# 亮色主题
hugo gen chromastyles --style=github > light-theme.css

# 暗色主题  
hugo gen chromastyles --style=dracula > dark-theme.css
```

2. **处理暗色模式样式**：
为暗色主题的所有 `.chroma` 选择器添加 `.dark` 前缀：
```bash
# 使用 sed 处理（Linux/macOS）
sed 's/^\.chroma/.dark .chroma/g' dark-theme.css > dark-theme-processed.css

# 或手动替换
# .chroma .k { color: #ff79c6; }
# 改为：
# .dark .chroma .k { color: #ff79c6; }
```

3. **合并到主文件**：
将处理后的样式替换到 `syntax-highlighting.css` 的对应部分。

## 变量映射表

### 🔤 **主要语法元素**

| CSS 类 | 变量名 | 说明 | 示例 |
|--------|--------|------|------|
| `.k`, `.kc`, `.kd`, `.kn`, `.kr`, `.kt` | `--chroma-k` | 关键字 | `function`, `class`, `if` |
| `.s`, `.sb`, `.sc`, `.sd`, `.s2`, `.s1` | `--chroma-s` | 字符串 | `"hello"`, `'world'` |
| `.c`, `.ch`, `.cm`, `.c1` | `--chroma-c` | 注释 | `// comment`, `/* block */` |
| `.n` | `--chroma-n` | 普通名称 | 变量名、函数名 |
| `.m`, `.mb`, `.mf`, `.mh`, `.mi` | `--chroma-m` | 数字 | `123`, `3.14`, `0xFF` |
| `.o`, `.ow` | `--chroma-o` | 操作符 | `+`, `-`, `&&`, `||` |

### 🎯 **特殊元素**

| CSS 类 | 变量名 | 说明 |
|--------|--------|------|
| `.nc` | `--chroma-nc` | 类名 |
| `.nf` | `--chroma-nf` | 函数名 |
| `.nt` | `--chroma-nt` | HTML 标签 |
| `.na` | `--chroma-na` | HTML 属性 |
| `.ln` | `--chroma-ln` | 行号 |
| `.hl` | `--chroma-hl` | 高亮行背景 |

## 主题变量集成

### 🎨 **代码块容器样式**

当前代码块使用主题变量：
```css
.chroma { 
  background-color: var(--chroma-wrapper-bg); 
  color: var(--chroma-color, inherit);
}
```

**建议保持不变**，因为这确保了代码块与主题的一致性。

### 🔧 **如果需要自定义容器**

可以在 CSS 变量中添加：
```css
:root:not(.dark) {
  --chroma-wrapper-bg: var(--color-card);  /* 使用主题卡片背景 */
  --chroma-color: var(--color-foreground); /* 使用主题前景色 */
}

.dark {
  --chroma-wrapper-bg: var(--color-card);  /* 暗色模式卡片背景 */
  --chroma-color: var(--color-foreground); /* 暗色模式前景色 */
}
```

## 推荐主题组合

### 🌟 **经典组合**

1. **GitHub 风格**：
   - 亮色：`github`
   - 暗色：`github-dark`

2. **现代暗色**：
   - 亮色：`github`
   - 暗色：`dracula`

3. **护眼组合**：
   - 亮色：`solarized-light`
   - 暗色：`solarized-dark`

4. **高对比度**：
   - 亮色：`vs`
   - 暗色：`monokai`

### 📋 **可用的 Chroma 样式**

运行以下命令查看所有可用样式：
```bash
hugo gen chromastyles --help
```

常用样式包括：
- `github`, `github-dark`
- `monokai`, `dracula`, `nord`
- `vs`, `xcode`, `xcode-dark`
- `solarized-light`, `solarized-dark`
- `onedark`, `native`

## 实际操作示例

### 📝 **示例：将亮色模式改为 VS 风格**

1. **生成 VS 样式**：
```bash
hugo gen chromastyles --style=vs > vs-theme.css
```

2. **查看生成的颜色**：
```css
/* vs-theme.css 中的关键部分 */
.chroma .k { color: #0000ff; }  /* 蓝色关键字 */
.chroma .s { color: #a31515; }  /* 红色字符串 */
.chroma .c { color: #008000; }  /* 绿色注释 */
```

3. **更新变量**：
在 `syntax-highlighting.css` 中：
```css
:root:not(.dark) {
  --chroma-k: #0000ff;    /* VS 蓝色关键字 */
  --chroma-s: #a31515;    /* VS 红色字符串 */
  --chroma-c: #008000;    /* VS 绿色注释 */
  /* ... 继续更新其他变量 */
}
```

## 注意事项

### ⚠️ **重要提醒**

1. **保持文件结构**：不要修改 CSS 选择器，只替换颜色值
2. **测试两种模式**：确保亮色和暗色模式都看起来正常
3. **备份原文件**：修改前备份 `syntax-highlighting.css`
4. **渐进式修改**：建议先修改几个主要变量测试效果

### 🎯 **最佳实践**

1. **颜色一致性**：选择的颜色应该与整体主题风格协调
2. **对比度**：确保代码的可读性，特别是注释和字符串
3. **语义化**：不同类型的语法元素使用不同的颜色
4. **无障碍性**：考虑色盲用户，避免仅依赖颜色区分

## 总结

当前的语法高亮系统已经非常完善：

✅ **无需修改文件结构** - 只需替换 CSS 变量中的颜色值  
✅ **完美的主题集成** - 代码块自动适配主题变量  
✅ **简单的自定义流程** - 生成 → 提取 → 替换  
✅ **强大的扩展性** - 支持所有 Hugo Chroma 主题  

你只需要：
1. 使用 `hugo gen chromastyles` 生成喜欢的主题
2. 提取颜色值
3. 替换 `syntax-highlighting.css` 中对应的 CSS 变量

这种方式既简单又灵活，完全满足自定义需求！🎉
