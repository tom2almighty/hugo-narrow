# 代码高亮功能使用说明

## 功能特性

✅ **Hugo Chroma 语法高亮** - 完全兼容 Hugo 的语法高亮配置
✅ **代码块 Header** - 显示语言名称、文件名和工具按钮
✅ **复制功能** - 一键复制代码，带成功反馈
✅ **行号支持** - 完全支持 Hugo 的 `lineNos` 配置
✅ **主题适配** - 背景色自动跟随主题变化
✅ **响应式设计** - 移动端友好
✅ **多语言支持** - 中英文界面

## 基础用法

### 标准代码块

```markdown
```javascript
console.log("Hello, World!");
```
```

### 带文件名的代码块

```markdown
```typescript {filename="api.ts"}
interface User {
  id: number;
  name: string;
}
```
```

### 带行号的代码块

```markdown
```python {lineNos=true}
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```
```

### 高亮特定行

```markdown
```go {lineNos=true hl_lines=[2,4]}
func main() {
    fmt.Println("Hello")  // 这行会被高亮
    x := 42
    fmt.Println(x)        // 这行也会被高亮
}
```
```

## Hugo 配置

当前配置位于 `hugo.yaml`:

```yaml
markup:
  highlight:
    codeFences: true      # 启用代码围栏
    guessSyntax: true     # 自动检测语言
    lineNos: false        # 默认不显示行号
    lineNumbersInTable: true  # 使用表格形式显示行号，便于复制时排除行号
    noClasses: false      # 使用 CSS 类
    style: github         # 基础样式
    tabWidth: 2          # 制表符宽度
```

### 行号复制问题解决

**问题**: 当显示行号时，复制功能会将行号一起复制。

**解决方案**:
1. **内联行号** (`lineNumbersInTable: false`) - 当前配置
   - 行号使用 `<span class="ln">` 标签
   - 代码内容使用 `<span class="cl">` 标签
   - 复制时只选择 `.cl` 元素，自动排除 `.ln` 行号
   - 避免表格样式的复杂性

2. **智能检测算法** - JavaScript 自动识别不同的行号显示方式
   ```javascript
   // 检查是否有内联行号
   const hasInlineLineNumbers = codeElement.querySelector('.ln');
   if (hasInlineLineNumbers) {
     // 从 .cl 元素中提取代码内容
     const codeLines = codeElement.querySelectorAll('.cl');
     codeText = Array.from(codeLines)
       .map(line => {
         const text = line.textContent || line.innerText;
         // 移除每行末尾的换行符，但保留行内的空白字符和缩进
         return text.replace(/\n+$/, '');
       })
       .join('\n')
       .replace(/\n+$/, ''); // 移除最后的多余换行符
   }
   ```

3. **空行处理** - 正确处理代码中的空行
   - 保留代码中的原始空行（这些是有意义的）
   - 移除每行末尾的多余换行符
   - 移除整个代码块末尾的多余换行符
   - 保持代码的原始缩进和格式

4. **HTML 结构示例**
   ```html
   <!-- 带行号的结构 -->
   <span class="line">
     <span class="ln">1</span>
     <span class="cl">def hello():</span>
   </span>

   <!-- 无行号的结构 -->
   <span class="line">
     <span class="cl">def hello():</span>
   </span>
   ```

### 可用配置选项

- `lineNos`: `true/false/table/inline` - 行号显示方式
- `hl_lines`: `[1,3-5]` - 高亮指定行
- `linenostart`: `10` - 行号起始值
- `anchorLineNos`: `true` - 行号可点击锚点
- `lineAnchors`: `prefix` - 行号锚点前缀

## 自定义样式

### 使用内置样式生成器

```bash
# 生成 GitHub 风格样式（默认）
./scripts/generate-chroma-styles.sh

# 生成 Monokai 风格样式
./scripts/generate-chroma-styles.sh monokai

# 生成 Dracula 风格样式
./scripts/generate-chroma-styles.sh dracula

# 生成 VS 风格样式
./scripts/generate-chroma-styles.sh vs
```

### 查看所有可用样式

```bash
hugo gen chromastyles --help
```

### 手动生成样式

```bash
# 生成特定样式
hugo gen chromastyles --style=monokai > assets/css/syntax-highlighting.css
```

## 文件结构

```
assets/css/
├── main.css                    # 主样式文件
└── syntax-highlighting.css     # 语法高亮样式

layouts/_default/_markup/
└── render-codeblock.html       # 代码块渲染模板

assets/icons/
├── code.svg                    # 代码图标
├── copy.svg                    # 复制图标
├── check.svg                   # 成功图标
└── file-text.svg              # 文件图标

scripts/
└── generate-chroma-styles.sh   # 样式生成脚本
```

## 技术实现

### 核心原理

1. **Hugo Transform**: 使用 `transform.HighlightCodeBlock` 进行语法高亮
2. **Render Hook**: 自定义代码块渲染，添加 Header 和工具按钮
3. **CSS 变量**: 通过 CSS 变量实现主题适配
4. **独立样式**: 语法高亮样式独立加载，避免 Tailwind CSS v4 兼容性问题

### 关键代码

```go
{{/* 使用 Hugo 的 transform.HighlightCodeBlock 进行语法高亮 */}}
{{- $highlighted := transform.HighlightCodeBlock . -}}

{{/* 渲染高亮后的代码 */}}
{{ $highlighted.Wrapped }}
```

## 故障排除

### 语法高亮不显示

1. 检查 `hugo.yaml` 中的 `noClasses: false`
2. 确认 `assets/css/syntax-highlighting.css` 文件存在
3. 检查浏览器开发者工具中是否加载了语法高亮样式

### 行号不显示

1. 在代码块中添加 `{lineNos=true}`
2. 或在 `hugo.yaml` 中设置 `lineNos: true`

### 复制功能不工作

1. 检查浏览器是否支持 Clipboard API
2. 确认网站运行在 HTTPS 或 localhost 上
3. 查看浏览器控制台是否有 JavaScript 错误

### 复制内容有多余空行

1. 确认使用的是内联行号 (`lineNumbersInTable: false`)
2. 检查 JavaScript 是否正确选择了 `.cl` 元素
3. 验证 `text.replace(/\n+$/, '')` 逻辑是否正确执行
4. 在浏览器开发者工具中检查 HTML 结构是否符合预期

### 主题切换后样式异常

1. 强制刷新浏览器缓存 (Ctrl+F5)
2. 检查 CSS 变量是否正确定义
3. 确认暗色模式的 CSS 选择器 `.dark` 正确应用

## 性能优化

- **并行加载**: 主样式和语法高亮样式可并行下载
- **缓存友好**: 语法高亮样式变化频率低，缓存效果好
- **按需加载**: 只有包含代码块的页面才需要语法高亮样式
- **最小化**: 生产环境自动压缩 CSS 文件

## 扩展功能

### 添加新的工具按钮

在 `layouts/_default/_markup/render-codeblock.html` 的按钮区域添加：

```html
<button class="tool-btn">
  {{ partial "icon.html" (dict "name" "download" "size" "xs") }}
</button>
```

### 自定义主题样式

修改 `assets/css/syntax-highlighting.css` 中的 CSS 变量：

```css
:root:not(.dark) {
  --chroma-k: #your-color;  /* 关键字颜色 */
  --chroma-s: #your-color;  /* 字符串颜色 */
  --chroma-c: #your-color;  /* 注释颜色 */
}
```
