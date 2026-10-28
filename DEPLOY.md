# 把 BullU 发布到 GitHub Pages

这个版本已经处理好了 GitHub Pages 的项目子路径问题：Vite 使用相对路径，图片和 favicon 也是相对路径，所以仓库不需要固定名字。

## 1. 上传到 GitHub

在 GitHub 新建一个 **Public** 仓库，例如 `bullu`，然后把本压缩包里的**全部内容**上传到仓库根目录。

不要在仓库里上传：

- `.env.local`
- `node_modules/`
- `dist/`

这些已经被 `.gitignore` 排除。

## 2. 配置 Mapbox token

GitHub 仓库 → **Settings → Secrets and variables → Actions → New repository secret**

- Name: `VITE_MAPBOX_TOKEN`
- Value: 你的 Mapbox **public** token（`pk.` 开头）

然后在 Mapbox 后台把这个 token 的 URL restrictions 加上：

- `http://127.0.0.1:5180/*`（本地）
- `https://你的用户名.github.io/你的仓库名/*`（GitHub Pages）

不设置 token 时页面能打开，但地图会是空白；不要把 secret token 放进仓库。

## 3. 开启 GitHub Pages

仓库 → **Settings → Pages** → **Build and deployment** → Source 选择 **GitHub Actions**。

## 4. 推送/触发部署

把代码推到 `main`（或 `master`）后，仓库的 **Actions** 里会自动运行 `Deploy BullU to GitHub Pages`。

第一次部署完成后，地址通常是：

```text
https://你的用户名.github.io/你的仓库名/
```

这个项目使用 hash 路由（`#/map`、`#/market` 等），所以不需要额外的 SPA 404 fallback。

## 5. 本地运行

```bash
pnpm install
cp .env.example .env.local
# 在 .env.local 填入真实 public token
pnpm dev
```

本地地址：`http://127.0.0.1:5180/`

## 常见问题

- **地图空白**：检查 GitHub Actions 的 `VITE_MAPBOX_TOKEN` secret，以及 Mapbox token 是否允许 `https://用户名.github.io/仓库名/*`。
- **图片 404**：确认 `public/brand` 和 `public/images` 已完整上传；相对路径依赖这些文件。
- **Actions 没有运行**：确认 Settings → Pages 的 Source 已选 GitHub Actions，并检查仓库 Actions 是否被禁用。
- **想用自己的域名**：在 Settings → Pages → Custom domain 绑定域名，并同步把域名加入 Mapbox token 的 URL restrictions。
