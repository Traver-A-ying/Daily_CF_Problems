# 无限骰子 Web 小程序

这是一个纯前端的可交互网页版本，直接用浏览器打开即可游玩，适合部署到任意静态站点（如 GitHub Pages、Vercel、Netlify、Nginx 静态目录等）。

## 本地运行

在项目目录下执行：

```bash
cd infinite_dice_app
python -m http.server 8000
```

然后访问：`http://localhost:8000`。

## 部署到网页端

1. 将 `infinite_dice_app` 目录下的 `index.html`、`style.css`、`app.js` 上传到任意静态托管服务。
2. 保持三者在同一目录。
3. 访问对应 URL 即可游玩。

## 玩法简述

- **Roll N**：投 1 个骰子决定你本轮获得的骰子数量。
- **Score**：按当前骰子数量投掷并计算得分；当 N < 3 时触发连击裂变机制。
- **Reset**：清空当前与总分记录。
