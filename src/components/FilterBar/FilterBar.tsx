// src/components/FilterBar/FilterBar.tsx
import { useMovieStore } from '../../stores/useMovieStore'
import { useGenres } from '../../hooks/useMovies'
import { LANGUAGE_OPTIONS, RUNTIME_OPTIONS, type EraOption } from '../../types/movie'

const ERA_LABELS: Record<EraOption, string> = {
  classic: '经典',
  '90s': '90s',
  '00s': '00s',
  '10s': '10s',
  recent: '近5年',
}

const tagStyle = (active: boolean): React.CSSProperties => ({
  padding: '4px 10px',
  fontSize: 12,
  borderRadius: 999,
  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
  background: active ? 'var(--accent)' : 'transparent',
  color: active ? 'var(--bg)' : 'var(--muted)',
  cursor: 'pointer',
  transition: 'all 0.2s',
})

export function FilterBar() {
  const { filters, toggleGenre, setEra, setMinRating, setMaxRating, setLanguage, setMaxRuntime } = useMovieStore()
  const { data: genres = [] } = useGenres()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 类型 */}
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>类型</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {genres.map((genre) => (
            <button key={genre.id} onClick={() => toggleGenre(genre.id)} style={tagStyle(filters.genres.includes(genre.id))}>
              {genre.name}
            </button>
          ))}
        </div>
      </section>

      {/* 年代 */}
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>年代</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {Object.entries(ERA_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setEra(filters.era === key ? null : key as EraOption)} style={tagStyle(filters.era === key)}>
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* 评分 */}
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>
          评分 {filters.minRating.toFixed(1)} - {filters.maxRating.toFixed(1)}
        </h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="range" min={5} max={9} step={0.5} value={filters.minRating} onChange={(e) => setMinRating(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--accent)' }} />
          <input type="range" min={5} max={10} step={0.5} value={filters.maxRating} onChange={(e) => setMaxRating(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--accent)' }} />
        </div>
      </section>

      {/* 语言 */}
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>语言</h3>
        <select
          value={filters.language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ width: '100%', padding: '6px 12px', fontSize: 13, background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 8 }}
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </section>

      {/* 片长 */}
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>片长</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {RUNTIME_OPTIONS.map((opt) => (
            <button key={String(opt.value)} onClick={() => setMaxRuntime(opt.value)} style={tagStyle(filters.maxRuntime === opt.value)}>
              {opt.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
