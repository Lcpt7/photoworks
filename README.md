# Photo Works

一个纯静态的个人照片与视频作品集，无需数据库、无需后端，可直接部署到 Cloudflare Pages。

## 特性

* 响应式布局，适配桌面端与移动端
* 照片与视频统一展示
* 无构建步骤，无框架依赖
* 支持 Cloudflare Pages 一键部署
* 纯静态资源，维护成本低
* 支持持续追加作品

## 本地预览

直接打开 `index.html` 即可预览。

项目没有构建步骤，也不依赖后端服务。

## 添加作品

### 添加照片

1. 将照片放入 `works` 文件夹。
2. 在 `gallery-data.js` 中新增一条记录。

示例：

```js
{
  type: "photo",
  src: "works/example.jpg",
  title: "作品标题",
  subtitle: "Optional English Title",
  date: "2026.06",
  camera: "相机型号",
  location: "拍摄地点",
  description: "这张作品的简短说明。",
  accent: "#b94735",
  width: 2500,
  height: 3600,
  tags: ["portrait", "night"]
}
```

### 添加视频

推荐将视频上传至 GitHub Release，并在 `gallery-data.js` 中填写对应下载链接。

示例：

```js
{
  type: "video",
  src: "https://github.com/username/repository/releases/download/v1.0/example.mp4",
  title: "视频标题",
  subtitle: "Optional English Title",
  date: "2026.06",
  camera: "相机型号",
  location: "拍摄地点",
  description: "这段视频的简短说明。",
  accent: "#2f88a2",
  width: 1920,
  height: 1080,
  tags: ["video", "travel"]
}
```

## Cloudflare Pages 部署

创建 Cloudflare Pages 项目后使用以下配置：

* Framework preset：`None`
* Build command：`exit 0`
* Build output directory：`.`
* Root directory：仓库根目录

部署完成后，每次推送到 GitHub 仓库都会自动重新部署。

## 缓存策略

项目内置 `_headers` 配置：

* 照片与视频资源长期缓存
* CSS 文件缓存 1 天
* `gallery-data.js` 自动检查更新

因此新增作品后，访客通常无需手动清除浏览器缓存即可看到最新内容。

## 项目结构

```text
.
├── index.html
├── app.js
├── gallery-data.js
├── styles.css
├── works/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── ...
└── _headers
```

## License

MIT License
