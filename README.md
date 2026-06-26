# Film Dice 🎬🎲

A random movie picker that draws cards from a curated pool of highly-rated films — discover great movies you haven't seen yet.

[中文文档](./README_CN.md)

## Features

- 🎲 Random card draw with flip animation (5 cards at a time)
- 🔍 Multi-dimensional filters (genre / era / rating / language / runtime)
- 📋 Want-to-watch & watched lists
- 📜 Draw history
- 🌙 Dark / light theme toggle
- 🎬 Movie pool viewer (up to 500 films)

## Live Demo

👉 https://tizero77.github.io/film-dice/

## Getting Started

### Prerequisites

- Node.js 18+
- A [TMDB](https://www.themoviedb.org/) API key (free)
- A [Supabase](https://supabase.com/) project (free tier)

### 1. Clone the repo

```bash
git clone https://github.com/TiZero77/film-dice.git
cd film-dice
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

You need two keys:

- **TMDB API Key** — register at https://www.themoviedb.org/settings/api
- **Supabase URL & Anon Key** — create a project at https://supabase.com, then find them in Settings → API

### 4. Create database tables

Go to Supabase Dashboard → SQL Editor and run:

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

### 5. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173

## Tech Stack

- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand) — state management
- [TanStack Query](https://tanstack.com/query) — data fetching & caching
- [Framer Motion](https://www.framer.com/motion/) — animations
- [TMDB API](https://developer.themoviedb.org/) — movie data
- [Supabase](https://supabase.com/) — user data storage

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
