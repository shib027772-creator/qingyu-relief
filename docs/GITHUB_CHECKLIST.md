# GitHub 上传清单

## 建议上传

- `src/`
- `scripts/`
- `docs/`
- `index.html`
- `package.json`
- `pnpm-lock.yaml`
- `pnpm-workspace.yaml`
- `vite.config.mjs`
- `vercel.json`
- `.vercelignore`
- `.npmrc`
- `.gitignore`
- `README.md`

## 不建议上传

- `node_modules/`
- `dist/`
- `.vercel/`
- `.pnpm-store/`
- `.env`
- `.env.local`
- 含 token、密钥、账号信息的文件
- 临时渲染文件
- 构建后的 ZIP 包

## 可选上传

如果是作品集仓库，可以上传少量展示素材：

- 产品截图
- 作品集说明图
- 一页 PPT 导出的 PNG

建议放在：

```text
docs/images/
```

不要把所有中间稿、临时 PPT、检查文件都传上去。作品集仓库要干净，读者一打开就能看懂项目。

## 推荐第一次提交信息

```bash
git add .
git commit -m "Initial qingyu emotional relief prototype"
git push
```

后续更新可以按功能写：

```bash
git commit -m "Add real meditation audio playback"
git commit -m "Improve breathing animation"
git commit -m "Add deployment documentation"
```
