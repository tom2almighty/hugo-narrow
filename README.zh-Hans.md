<img src="https://cdn.jsdelivr.net/gh/tom2almighty/hugo-narrow@main/images/screenshot.png" />

# Hugo Narrow

[English](README.md)

一个以阅读为核心的 Hugo 主题：自适应 dock、面包屑上下文栏、shadcn 语义 token，以及可调节的居中阅读宽度。

2.0 去掉了顶部导航，改为浮动自适应 dock、分开卡片式的面包屑，以及无重阴影的卡片内容。配置从 `header.*` 迁移到 `ui.appearance.*` 与 `ui.language.*`；首页区块名称为 `author-section`、`recent-posts`、`featured-projects`、`page-content`；公告可以手动关闭，不再自动消失。

## 开发环境

- Hugo Extended 0.165.0 或更高版本
- Node.js 18 或更高版本
- pnpm 10

```bash
pnpm install
pnpm run dev:parallel
```

`dev:parallel` 同时运行 Tailwind watch 和 Hugo server。如果只用 `hugo server`，修改 Tailwind 类名后需要先执行 `pnpm run compile`。

## 构建与部署

```bash
pnpm run check   # prettier 检查 + 生产构建
pnpm run build   # 编译 assets/css/compiled.css，再执行 hugo --minify
```

示例站点输出到 `exampleSite/public`。打包主题时必须带上重新生成的 `assets/css/compiled.css`，Hugo 只负责指纹化和压缩。主题不内置 Nginx 或容器配置，按自己的运行环境挂载或托管静态文件即可。

## 开源许可证

AGPL-3.0，详见 [LICENSE](LICENSE)。
