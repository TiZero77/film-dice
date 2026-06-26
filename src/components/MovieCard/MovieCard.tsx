// src/components/MovieCard/MovieCard.tsx
import { useMovieStore } from '../../stores/useMovieStore'
import { useMovieDetail } from '../../hooks/useMovies'
import { useWatchlist } from '../../hooks/useWatchlist'
import { useWatched } from '../../hooks/useWatched'
import { useDrawHistory } from '../../hooks/useDrawHistory'

const btnBase: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: 13,
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.2s',
}

const btnOutline: React.CSSProperties = {
  ...btnBase,
  background: 'transparent',
  border: '1px solid var(--accent)',
  color: 'var(--accent)',
}

const btnPrimary: React.CSSProperties = {
  ...btnBase,
  background: 'var(--accent)',
  border: 'none',
  color: 'var(--bg)',
}

const btnGhost: React.CSSProperties = {
  ...btnBase,
  background: 'transparent',
  border: '1px solid var(--border)',
  color: 'var(--muted)',
}

export function MovieCard() {
  const { selectedCard, resetDraw } = useMovieStore()
  const { data: detail } = useMovieDetail(selectedCard?.id ?? null)
  const watchlist = useWatchlist()
  const watched = useWatched()
  const drawHistory = useDrawHistory()

  if (!selectedCard) return null

  const movie = detail ?? selectedCard
  const year = movie.release_date?.slice(0, 4) ?? '未知'
  const rating = movie.vote_average?.toFixed(1) ?? '-'
  const runtime = detail?.runtime ? `${detail.runtime}分钟` : ''

  return (
    <div style={{ display: 'flex', gap: 24, maxWidth: 640, margin: '0 auto' }}>
      {/* 海报 */}
      <div style={{ flexShrink: 0, width: 200 }}>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
          />
        ) : (
          <div style={{ width: '100%', height: 300, background: 'var(--card)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            无海报
          </div>
        )}
      </div>

      {/* 详情 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 0 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{movie.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--muted)' }}>
          <span>{year}</span>
          <span style={{ color: 'var(--accent)', fontWeight: 500 }}>⭐ {rating}</span>
          {runtime && <span>{runtime}</span>}
        </div>
        {detail?.genres && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {detail.genres.map((g) => (
              <span key={g.id} style={{ padding: '2px 8px', fontSize: 11, border: '1px solid var(--border)', borderRadius: 999, color: 'var(--muted)' }}>
                {g.name}
              </span>
            ))}
          </div>
        )}
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          {movie.overview || '暂无简介'}
        </p>

        {/* 操作按钮 */}
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button onClick={() => watchlist.add.mutate(movie.id)} style={btnOutline}>想看</button>
          <button onClick={() => { watched.add.mutate({ movieId: movie.id }); drawHistory.add.mutate(movie.id) }} style={btnPrimary}>已看</button>
          <button onClick={resetDraw} style={btnGhost}>再抽一次</button>
        </div>
      </div>
    </div>
  )
}
