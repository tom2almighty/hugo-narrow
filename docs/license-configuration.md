# 许可证配置说明

## 全局配置 (hugo.yaml)

在 `hugo.yaml` 中配置默认的许可证信息：

```yaml
params:
  post:
    # 许可证配置
    showLicense: true           # 是否显示许可证信息
    license:
      name: "CC BY-NC-SA 4.0"  # 许可证名称
      description: "本作品采用知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议进行许可。转载请注明出处，非商业性使用，并保持相同的许可方式。"
      url: "https://creativecommons.org/licenses/by-nc-sa/4.0/"
      displayName: "知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议"
```

## Frontmatter 覆盖配置

在文章的 frontmatter 中可以覆盖全局配置：

### 1. 关闭许可证显示

```yaml
---
title: "文章标题"
showLicense: false  # 不显示许可证信息
---
```

### 2. 使用不同的许可证

```yaml
---
title: "文章标题"
license:
  name: "MIT"
  description: "本作品采用 MIT 许可证进行许可。"
  url: "https://opensource.org/licenses/MIT"
  displayName: "MIT 许可证"
---
```

### 3. 自定义许可证

```yaml
---
title: "文章标题"
license:
  name: "Custom License"
  description: "这是一个自定义的许可证说明。"
  url: "https://example.com/license"
  displayName: "自定义许可证"
---
```

### 4. 只覆盖部分配置

```yaml
---
title: "文章标题"
license:
  description: "这篇文章使用特殊的许可证说明。"
  # 其他配置继承全局设置
---
```

## 常用许可证配置示例

### Creative Commons BY 4.0

```yaml
license:
  name: "CC BY 4.0"
  description: "本作品采用知识共享署名 4.0 国际许可协议进行许可。转载请注明出处。"
  url: "https://creativecommons.org/licenses/by/4.0/"
  displayName: "知识共享署名 4.0 国际许可协议"
```

### MIT 许可证

```yaml
license:
  name: "MIT"
  description: "本作品采用 MIT 许可证进行许可。"
  url: "https://opensource.org/licenses/MIT"
  displayName: "MIT 许可证"
```

### Apache 2.0

```yaml
license:
  name: "Apache 2.0"
  description: "本作品采用 Apache 2.0 许可证进行许可。"
  url: "https://www.apache.org/licenses/LICENSE-2.0"
  displayName: "Apache 2.0 许可证"
```

## 配置字段说明

- `name`: 许可证简短名称，用于内部识别
- `description`: 许可证详细说明，显示在版权声明中
- `url`: 许可证链接，点击许可证名称时跳转
- `displayName`: 许可证显示名称，显示为链接文本
- `showLicense`: 是否显示许可证信息（全局或单篇文章）
