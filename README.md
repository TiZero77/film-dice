# TiZero 随机电影抽取

从高分片库中随机抽卡，发现你没看过的好电影。

## 启动项目

### 第一步：打开终端

Mac 用户打开 **终端**（Terminal），可以在启动台搜索"终端"。

### 第二步：进入项目目录

复制粘贴以下命令，按回车：

```bash
cd /Users/neo/Documents/随机电影清单推荐-抽取/tizero
```

### 第三步：启动开发服务器

```bash
npm run dev
```

看到类似这样的输出就说明启动成功了：

```
VITE v8.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 第四步：打开浏览器

在浏览器地址栏输入：

```
http://localhost:5173
```

即可看到项目页面。

### 关闭项目

在终端按 `Ctrl + C` 可以停止服务器。

---

## 常见问题

### 页面打不开？

检查终端有没有报错。如果端口被占用，可以换个端口启动：

```bash
npm run dev -- --port 3000
```

然后访问 `http://localhost:3000`

### npm 命令提示找不到？

确保你在 `tizero` 目录下（终端路径末尾应该是 `tizero`）。

### 抽取电影没反应？

检查 `.env` 文件里的 API Key 是否正确。文件位置：`tizero/.env`

---

## 项目结构（简单了解）

```
tizero/
├── src/              ← 源代码
│   ├── components/   ← 页面组件
│   ├── api/          ← API 请求
│   ├── hooks/        ← 数据钩子
│   ├── stores/       ← 状态管理
│   └── types/        ← 类型定义
├── .env              ← API 密钥（不要泄露）
└── package.json      ← 项目配置
```

## 技术栈

- React + Vite + TailwindCSS
- TMDB API（电影数据）
- Supabase（用户数据存储）
