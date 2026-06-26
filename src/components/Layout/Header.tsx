// src/components/Layout/Header.tsx
import { useMovieStore } from '../../stores/useMovieStore'

export function Header() {
  const { isDark, toggleTheme } = useMovieStore()

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: 2, color: 'var(--accent)' }}>
        TiZero
      </h1>
      <button
        onClick={toggleTheme}
        style={{ padding: 8, borderRadius: 8, fontSize: 18, background: 'transparent', border: 'none', cursor: 'pointer' }}
        aria-label="切换主题"
      >
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  )
}
