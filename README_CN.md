# Film Dice 🎬🎲

随机选片器 — 从高分片库中抽卡，发现你没看过的好电影。

[English](./README.md)

## 功能

- 🎲 随机抽卡（5 张卡牌翻牌动画）
- 🔍 多维筛选（类型 / 年代 / 评分 / 语言 / 片长）
- 📋 想看 / 已看列表
- 📜 抽取历史
- 🌙 明暗主题切换
- 🎬 片池浏览（最多 500 部电影）

## 在线体验

👉 https://tizero77.github.io/film-dice/

## 本地开发

### 前置条件

- Node.js 18+
- [TMDB](https://www.themoviedb.org/) API Key（免费）
- [Supabase](https://supabase.com/) 项目（免费）

### 1. 克隆项目

```bash
git clone https://github.com/TiZero77/film-dice.git
cd film-dice
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，填入你的 API Key：

```bash
cp .env.example .env
```

需要两个 Key：

- **TMDB API Key** — 免费注册：https://www.themoviedb.org/settings/api
- **Supabase URL 和 Anon Key** — 在 https://supabase.com 创建项目后，进入 Settings → API 获取

### 4. 创建数据库表

在 Supabase Dashboard → SQL Editor 执行：

```sql
CREATE TABLE watchlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE watched (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE draw_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  movie_id INTEGER NOT NULL,
  drawn_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_watchlist_user ON watchlist(user_id);
CREATE INDEX idx_watched_user ON watched(user_id);
CREATE INDEX idx_draw_history_user ON draw_history(user_id);

ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watched ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for watchlist" ON watchlist FOR ALL USING (true);
CREATE POLICY "Allow all for watched" ON watched FOR ALL USING (true);
CREATE POLICY "Allow all for draw_history" ON draw_history FOR ALL USING (true);
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:5173

## 技术栈

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand) — 状态管理
- [TanStack Query](https://tanstack.com/query) — 数据请求与缓存
- [Framer Motion](https://www.framer.com/motion/) — 动画
- [TMDB API](https://developer.themoviedb.org/) — 电影数据
- [Supabase](https://supabase.com/) — 用户数据存储

## 参与贡献

欢迎贡献！随时提交 Issue 和 Pull Request。

1. Fork 本仓库
2. 创建功能分支（`git checkout -b feature/xxx`）
3. 提交更改（`git commit -m 'feat: add xxx'`）
4. 推送分支（`git push origin feature/xxx`）
5. 发起 Pull Request

## 开源协议

MIT
