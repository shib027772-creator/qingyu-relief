# 轻愈部署说明

本项目是 React + Vite 构建的纯前端 H5 原型，构建后会生成静态文件，可以部署到 Vercel、Netlify、Cloudflare Pages、GitHub Pages，也可以上传到国内静态托管平台。

## 1. 构建项目

安装依赖：

```bash
pnpm install
```

生成生产文件：

```bash
pnpm build
```

构建完成后，静态文件位于：

```text
dist/
```

## 2. Vercel 部署

适合快速作品集展示，但中国大陆访问可能不稳定。

### 控制台部署

1. 将项目上传到 GitHub。
2. 打开 [Vercel](https://vercel.com/)。
3. Import Git Repository。
4. Framework Preset 选择 `Vite`。
5. Build Command 使用：

```bash
pnpm build
```

6. Output Directory 使用：

```bash
dist
```

7. 点击 Deploy。

### 注意

- 不要把 Vercel Token 写进代码或 README。
- 不要上传 `.vercel/` 文件夹。
- 如果换国内展示链接，README 里的在线体验地址也要同步更新。

## 3. Netlify 部署

适合快速前端展示，国内访问稳定性通常也不如国内云。

配置：

```text
Build command: pnpm build
Publish directory: dist
```

如果使用拖拽部署，也可以直接上传 `dist/` 文件夹。

## 4. Cloudflare Pages 部署

适合静态站点和前端项目，但在部分国内网络下访问也可能不稳定。

配置：

```text
Framework preset: Vite
Build command: pnpm build
Build output directory: dist
```

## 5. GitHub Pages 部署

适合和 GitHub 仓库绑定展示，但国内访问也不一定稳定。

如果部署到 `https://username.github.io/repo-name/` 这种子路径，需要在 `vite.config.mjs` 中配置：

```js
export default defineConfig({
  base: "/repo-name/",
  plugins: [react()],
});
```

如果部署到自定义域名或根路径，则通常不需要设置 `base`。

## 6. 国内访问更稳定的部署方式

如果目标是“简历里放链接，国内也能尽量顺畅打开”，建议优先考虑：

- 腾讯云 EdgeOne Pages
- 腾讯云 COS + CDN
- 阿里云 OSS + CDN
- 又拍云 / 七牛云等国内对象存储 + CDN

### 最快方案：上传静态包

当前项目已经可以构建为静态站点。操作方式：

1. 执行 `pnpm build`。
2. 将 `dist/` 压缩为 ZIP。
3. 上传到支持静态网站的国内平台。
4. 获得平台默认访问域名。

### 长期稳定方案：自有域名 + 备案 + CDN

如果要长期放在简历中，建议：

1. 购买域名，例如 `qingyu-care.cn` 或 `qingyu-relief.com`。
2. 完成 ICP 备案。
3. 将静态文件部署到国内对象存储或 Pages 平台。
4. 配置 CDN 和 HTTPS。
5. ICP 备案完成后，根据平台要求完成公安联网备案。

说明：

- 使用中国大陆节点和自定义域名，通常需要 ICP 备案。
- 备案通常不收费，但需要时间和主体资料。
- 如果不想备案，可以使用境外节点，但国内访问稳定性会下降。

## 7. 音频资源部署注意

当前冥想音频使用公开非商业参考资源，仅适合原型和作品集展示。

正式上线前建议：

1. 自己录制或购买授权普通话音频。
2. 上传到国内对象存储，例如腾讯云 COS / 阿里云 OSS。
3. 配置 HTTPS 和 CDN。
4. 在代码中的音频配置表里替换 `audioUrl`。

否则可能出现：网页能打开，但音频加载慢或播放失败。

## 8. 微信小程序版本建议

当前项目是 H5，不建议直接用小程序 `web-view` 套壳作为正式版。

更推荐迁移为：

- Taro
- uni-app
- 微信原生小程序

需要改造：

- `localStorage` → `wx.setStorageSync / wx.getStorageSync`
- `<audio>` → `wx.createInnerAudioContext`
- React 页面路由 → 小程序页面路由
- CSS → WXSS 或框架兼容写法
- 远程音频/图片域名 → 小程序合法域名配置

第一版小程序仍建议保持无登录使用。急救功能不应被注册、登录或授权流程打断。

## 9. 上线前检查清单

- [ ] 页面移动端布局正常
- [ ] 三个底部 Tab 可切换
- [ ] 急救工具均可进入
- [ ] 呼吸法动效连续、暂停/重置可用
- [ ] 心情记录可保存、修改、删除
- [ ] localStorage 数据正常
- [ ] 音频可播放，并有加载失败提示
- [ ] 页面包含免责声明
- [ ] 不包含 token、密钥、账号信息
- [ ] 第三方音频/图片/字体有授权说明
- [ ] 国内访问链接经过手机测试
