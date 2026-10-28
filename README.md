# BullU — UKM Bangi 智慧校园平台

一个面向 UKM Bangi 学生的校园入口原型：Mapbox 校园地图、新生中心、二手市场、校园社区、校园巴士、学生优惠与商家合作。整体采用白底、浅蓝、圆角和大量留白的视觉语言，桌面与移动端均已适配。

> 独立学生项目，非 UKM 官方平台。当前为前端演示版本，数据保存在浏览器本地，不构成真实导航、教务或交易服务。

## 运行

```bash
pnpm install
pnpm dev
```

访问 `http://127.0.0.1:5180/`。生产构建与类型检查：

```bash
pnpm check
pnpm build
```

项目位于 `D:\BullU`，依赖缓存位于 `D:\pnpm-store`。

## 校园地图

首页和校园地图页都使用 **Mapbox GL JS**，需要 Mapbox public token，详见下面的“Mapbox 配置”。完整地图页不再渲染本地虚拟地图，而是使用真实底图和 OpenStreetMap 数据。

- **地图**：Mapbox Standard 真实底图，支持滚轮、双指和缩放按钮。
- **3D**：同一张 Mapbox 底图的倾斜视角，可以拖动旋转。
- 10 个校园地点共享左侧搜索、分类筛选和详情卡片。
- 底图、道路和校园建筑来自 Mapbox / OpenStreetMap；10 个地点坐标和路线仍是 BullU 演示数据。

Mapbox satellite 图层暂未启用，因为当前 token 请求 satellite tiles 返回 429；需要等额度恢复或确认账号套餐后再加回。

全站支持中文 / English / Bahasa Melayu 切换。桌面端切换器在 Header 右上角，移动端在菜单内；校园地图页标题右侧也保留了快捷切换。导航、页面正文、演示数据、搜索、表单、弹窗和 Toast 会同步切换，选择会保存在本机浏览器。

首页是左右分栏：左侧文案与统计保持不变，右侧是一块 Mapbox GL JS 的 3D 地球；页面加载后地球会自动从世界视角俯冲到 UKM。数据卡、地点标签和底部状态是 HTML 叠加在地图上。右下角保留 `© Mapbox © OpenStreetMap` 署名。

> 校园地点使用根据 UKM 校园范围换算出的演示坐标；正式版本仍需人工核对具体建筑与入口。底图由 Mapbox 提供，不是离线地图。

## 品牌入场动画

首次完整打开页面时会播放约 5 秒的品牌粒子动画：黑暗中红色牛角亮起，蓝色粒子汇聚成 BullU 公牛，向前冲锋并爆散，最后重新聚成 Logo 与品牌字标。

- 粒子形态来自 BullU 牛头 Logo，最终落回完整品牌字标；不依赖视频素材。
- Three.js 粒子渲染，桌面和移动端都做了密度/尺寸适配。
- 右下角可跳过；`?intro=0` 也会跳过，方便截图和调试。
- 系统开启 `prefers-reduced-motion: reduce` 时会直接进入页面。
- 只会在完整页面加载时出现，站内 hash 路由切换不会再打断浏览。
- 首屏页面组件已做懒加载，HTML 自带启动牛影，避免等主包时白屏。

## 已实现

- 品牌入场：约 5 秒的 BullU 粒子公牛动画，支持跳过和减少动态效果设置。
- 首页：左侧校园入口 + 右侧 Mapbox 3D 地球俯冲至 UKM、场景卡片、今日校园、二手市场预览、学生优惠与社区氛围区。
- 校园地图：Mapbox 真实底图，地图 / 3D 两种视角，10 个地点，搜索与分类筛选，地点详情，缩放、拖动、路线示意和三语内容。
- 新生中心：4 步入学报到清单、首周资源库、文章弹窗、常见问题。
- 二手市场：搜索、筛选、排序、收藏、商品详情、图片上传与发布（浏览器本地保存）。
- 校园社区：话题筛选、搜索、发帖、点赞、社区侧栏。
- 校园巴士：路线筛选、下一班时间、工作日 / 周末时刻与站点。
- 学生优惠：合作商家优惠、领券状态、`Sponsored` 明确标记。
- 商家合作：演示数据仪表盘、合作方案、联系表单与演示说明。

## 数据与隐私

- 演示账号、收藏、已读状态、发帖、优惠领取等数据写入 `localStorage`，不会上传到服务器。
- 当前没有后端、真实认证、支付、订单或消息推送。
- 校园地点、巴士时刻、开放时间、优惠内容和商家数据均为演示数据。

## 限制与后续

- 首页与地图页使用 Mapbox 真实底图；校园地点坐标与路线为演示数据，不提供真实导航。
- 卫星图层暂未启用（当前 token 的 satellite tiles 返回 429），后续可根据账号额度恢复。
- 校园地点坐标、3D 模型和巴士时刻都需要后续人工核对或替换。
- 全站已接入中文 / English / Bahasa Melayu，包括首页、地图、新生中心、二手市场、社区、巴士、学生优惠、商家合作，以及搜索、登录/加入、表单和弹窗。
- 翻译为演示版本的人工文案；用户自己输入的姓名、商品名和讨论内容会保持原文。正式上线前建议由母语者再校对一轮。
- 首页与地图页均使用 Mapbox / OpenStreetMap 数据。Mapbox 的免费额度和计费规则以其官网为准。

## 发布到 GitHub Pages

项目已包含 `.github/workflows/deploy.yml`，并已改成相对资源路径，能直接部署在 `https://用户名.github.io/仓库名/` 子路径下。

完整步骤见 [`DEPLOY.md`](DEPLOY.md)。核心是：

1. 上传除 `.env.local`、`node_modules`、`dist` 之外的全部文件到 Public 仓库。
2. 在仓库 Secrets 添加 `VITE_MAPBOX_TOKEN`。
3. Settings → Pages → Source 选择 **GitHub Actions**。
4. 推送到 `main` / `master`，等待 Actions 完成。

GitHub Pages 部署后，把 `https://用户名.github.io/仓库名/*` 加进 Mapbox token 的 URL restrictions，否则地图可能被拒绝。

## 技术栈

React 19 · TypeScript 7 · Vite 8 · Mapbox GL JS · Three.js · lucide-react · Inter

## 国际化

- 文案字典集中在 `src/i18n.ts`，支持 `zh`、`en`、`ms` 三种语言。
- Header 与移动端菜单负责切换；语言写入 `bullu-language`，并同步 `<html lang>` 与页面标题。
- 页面内容通过 `LocalizedPage` 边界翻译渲染树，因此演示数据也会跟随语言切换。
- 新增文案时，直接在 `i18n.ts` 的对应语言对象中补 key；未命中时会回退到中文源文案。

## Mapbox 配置

首页右侧地图使用 Mapbox GL JS。项目根目录需要 `.env.local`：

```bash
VITE_MAPBOX_TOKEN=pk.你的public_token
```

- 使用 `pk.` 开头的 public token，不要使用 secret token。
- 在 Mapbox 后台给 token 设置 URL restrictions，至少包含本地 `http://127.0.0.1:5180/*` 和正式域名。
- `.env.local` 已被 `.gitignore` 排除，不要提交 token。
- Mapbox 有免费额度，但属于计费服务，超出后可能收费；上线前设置 spend limit。
- 保留 Mapbox logo 和 `© Mapbox © OpenStreetMap` attribution，不能用自己的 UI 遮住。

## 素材

页面摄影素材来自 Unsplash，作为原型演示使用；页脚保留了 Unsplash 说明。校园地图底图由 Mapbox 提供，不包含 Google 地图截图或 Google 地图瓦片；10 个地点的坐标与路线为 BullU 演示数据。

首页地图底图与地球来自 Mapbox，地图数据包含 OpenStreetMap 贡献者数据；界面保留 `© Mapbox © OpenStreetMap` 署名。
