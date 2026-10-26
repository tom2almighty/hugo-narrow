<img src="images/screenshot.png" />

# Hugo Narrow

**[文档](https://tom2almighty.github.io/hugo-narrow-docs/zh/)** · **[演示](https://tom2almighty.github.io/hugo-narrow/zh-hans/)** · **[English](README.md)**

一个以阅读为核心的 Hugo 主题：自适应 dock、面包屑上下文栏、shadcn 语义 token，以及可调节的居中阅读宽度。


> [!NOTE]
> v2.1.1 是 Hugo Narrow 2.x 的最终版本，v2 不再维护。Go template 布局的维护成本过高，现有 v2 站点请固定使用 v2.1.1。
> v1 的最终版本为 v1.4.1，保留在 `v1` 分支。
> 完整的破坏性变更与迁移说明见 [2.0.0 Release Notes](https://github.com/tom2almighty/hugo-narrow/releases/tag/v2.0.0)。
> v1 预览地址：https://tom2almighty.github.io/hugo-narrow/v1/。

## 开发环境

- Hugo Extended 0.165.0 或更高版本
- Go 1.26 或更高版本（用于 `gotmplfmt`）
- Node.js 18 或更高版本
- pnpm 10

```bash
go install github.com/gohugoio/gotmplfmt@v0.5.0
pnpm install
pnpm run dev:parallel
```

`dev:parallel` 同时运行 Tailwind watch 和 Hugo server。如果只用 `hugo server`，修改 Tailwind 类名后需要先执行 `pnpm run compile`。

## 构建与部署

```bash
pnpm run check   # 格式检查 + 生产构建
pnpm run build   # 编译 assets/css/compiled.css，再执行 hugo --minify
```

示例站点输出到 `exampleSite/public`。打包主题时必须带上重新生成的 `assets/css/compiled.css`，Hugo 只负责指纹化和压缩。主题不内置 Nginx 或容器配置，按自己的运行环境挂载或托管静态文件即可。

## 开源许可证

AGPL-3.0，详见 [LICENSE](LICENSE)。
