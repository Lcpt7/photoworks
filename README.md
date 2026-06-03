# Photo Works

一个纯静态的个人照片和视频作品集，适合直接部署到 Cloudflare Pages。

## 本地预览

直接打开 `index.html` 即可预览。项目没有构建步骤，也不依赖后端服务。

## 添加作品

1. 把新照片或视频放进 `works` 文件夹。
2. 打开 `gallery-data.js`，追加一条记录。

照片示例：

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

视频示例：

```js
{
  type: "video",
  src: "works/example.mp4",
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

在 Cloudflare Pages 新建项目后使用这些设置：

- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `.`
- Root directory: 仓库根目录

`_headers` 已经包含基础安全响应头和素材缓存策略。照片、视频文件如果后续会替换同名文件，建议改文件名后再更新 `gallery-data.js`，这样浏览器不会继续使用旧缓存。
