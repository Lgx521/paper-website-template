# Paper Website Template · HKUST × SUSTech

一个可长期复用的论文项目网页模板。参考 [Rapid Embodiment Adaptation](https://embodiment-adaptation.github.io/) 的单页版式，重新实现了标题、作者、学校标志、资源链接、视频、摘要、方法、实验结果和 BibTeX 区域。

- **配色**：HKUST 海军蓝 `#003366` + 官方金色 `#996600`，白色背景。
- **标志**：HKUST 官方素材 + 由用户提供的 SUSTech `LOGO.ai` 转出的矢量 SVG。
- **零 npm 依赖**：原生 HTML / CSS / JavaScript，没有框架、远程字体或统计脚本。
- **论文信息集中配置**：修改 `paper.config.mjs`，一个命令生成完整 HTML 和引用文件。
- **内容可直接读取**：提交的 `index.html` 已含所有正文，关闭 JavaScript 也能阅读，便于搜索引擎索引。
- **媒体**：支持图片、本地 MP4、字幕、YouTube、双栏图组及多组实验。
- **交互**：复制 BibTeX、下载 `.bib`、移动端布局、键盘焦点、打印样式。

页面中的作者、会议、正文、图和视频均为明确的示例占位内容，没有沿用参考论文的研究结果。

## 1. 本地预览

直接打开 `index.html` 即可浏览已生成的模板。更推荐启动本地服务器：

```bash
cd paper-website-template
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:8000>。不需要 `npm install`。

## 2. 用于一篇新论文

1. 复制这个仓库，或将仓库设为 GitHub 的 **Template repository** 后选择 **Use this template**。
2. 修改 `paper.config.mjs` 中的标题、作者、单位编号、会议、摘要、章节、资源链接与 BibTeX。
3. 将图片放入 `assets/figures/`，视频和字幕放入 `assets/videos/`。
4. 运行以下命令（需要 Node.js 20 或更新版本）：

```bash
node scripts/build.mjs
node scripts/check.mjs
```

5. 刷新预览页面，提交配置、生成的 `index.html` / `citation.bib` 和资源文件。

```bash
git add .
git commit -m "Add paper content"
git push
```

不要在修改配置后忘记重新生成页面。CI 会检查 `index.html` 与配置是否一致。也可以运行 `npm run build` / `npm run check`；无需安装包。

### 常改字段

| 字段 | 用途 |
| --- | --- |
| `title` | 论文标题；用 `\n` 指定断行，首行金色、后续行海军蓝 |
| `venue` | 会议 / 年份 / 状态；设为空字符串即可隐藏 |
| `authors` | 作者姓名、单位编号、贡献标记、个人主页 |
| `institutions` | 学校名称、编号、Logo 路径、链接和显示宽度 |
| `resources` | Paper / Code / Video 等链接；空链接显示 Soon，删除条目可隐藏 |
| `teaser` | 首页视频或主图；设为 `null` 可隐藏，同时删除指向 `#video` 的资源链接 |
| `abstract` | 摘要正文 |
| `sections` | 任意数量的正文段落、图、视频与实验；`visible: false` 隐藏一节 |
| `takeaways` | 结论列表；空数组隐藏 |
| `bibtex` | 引用文本，同时用于页面和 `.bib` 下载；空字符串隐藏引用区域 |
| `siteUrl` | 真实发布网址，用于 canonical 和分享元信息 |
| `socialImage` | 可选的绝对 HTTPS 分享封面地址 |

文本字段以纯文本处理，自动转义特殊字符，不必编写 HTML。颜色和布局集中在 `styles.css` 开头。

### 替换媒体

所有 `teaser` / `media` 对象使用同一格式。例如：

```js
// 图片：alt 描述内容，caption 解释图的意义。
{
  type: 'image',
  src: 'assets/figures/overview.jpg',
  alt: 'Overview of the proposed three-stage architecture',
  caption: 'Figure 1. Overview of our method.',
}

// 本地视频：按需提供封面与 WebVTT 字幕。
{
  type: 'video',
  label: 'Real-world demonstration',
  src: 'assets/videos/demo.mp4',
  poster: 'assets/figures/demo-poster.jpg',
  tracks: [{ src: 'assets/videos/demo-en.vtt', label: 'English', lang: 'en', default: true }],
  caption: 'Performance under different experimental conditions.',
}

// YouTube：复制链接 v= 后的 11 位 ID，使用增强隐私域名嵌入。
{
  type: 'youtube',
  videoId: 'YOUR_11_CHAR_VIDEO_ID', // 换成真实 ID；生成器会校验长度
  label: 'Project video',
  caption: 'A brief overview of the work.',
}
```

章节设置 `columns: 2` 可并排展示图组，手机端自动变成单列。路径使用 `assets/...`，不要使用 `/assets/...`，这样在 GitHub Pages 的仓库子目录下也能正常显示。

## 3. 发布到 GitHub Pages

仓库包含可手动运行的 GitHub Pages 工作流。首次上传只运行校验，不自动公开发布网页。

1. 仓库 **Settings → Pages → Source** 选择 **GitHub Actions**。
2. 修改 `siteUrl` 为最终网址，运行生成命令并提交。
3. 进入 **Actions → Deploy GitHub Pages → Run workflow**。
4. 部署成功后，工作流中的 `github-pages` 环境会显示真实网址。

本仓库启用后，默认地址为 `https://Lgx521.github.io/paper-website-template/`。换成自己的仓库时，请以 GitHub 返回的地址为准。

若想每次 push 自动部署，取消 `.github/workflows/pages.yml` 中 `push` 两行的注释。工作流只把网站所需文件打包到 `dist/`；不把源码说明或脚本放入发布包。

也可以选择 **Deploy from a branch → main → /(root)**，直接发布已经生成的静态文件；两种方式选一种即可。

## 文件结构

```text
paper.config.mjs         # 每篇论文只需主要修改这里
index.html              # 自动生成、可直接打开的完整网页
styles.css              # 配色、排版和响应式布局
main.js                 # 渐进增强：BibTeX 复制
citation.bib            # 自动生成的可下载引用
assets/logos/           # HKUST 与 SUSTech 矢量标志
assets/figures/          # 方法示意图占位；替换为论文图片
assets/videos/          # 放视频和字幕
scripts/build.mjs       # 无依赖页面生成器
scripts/check.mjs       # 检查本地文件、锚点与基本 HTML 结构
scripts/package.mjs     # 将公开网站文件打包至 dist/
.github/workflows/      # 内容校验与手动 Pages 部署
docs/ASSETS.md          # 标志、配色与版式来源
```

## 来源和许可

版式参考原网页并在页脚保留致谢；模板代码为重新实现，采用 [MIT License](LICENSE)。没有复制参考论文的正文、实验媒体或商业字体。学校标志的权利属于相应学校，不包含在代码的 MIT 授权中。来源详见 [docs/ASSETS.md](docs/ASSETS.md)。
