import { useDrawHistory } from '../../hooks/useDrawHistory'
import { useMovieDetail } from '../../hooks/useMovies'

function HistoryRow({ movieId, drawnAt }: { movieId: number; drawnAt: string }) {
  const { data: movie } = useMovieDetail(movieId)

  if (!movie) return null

  const date = new Date(drawnAt).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4 }} />
      ) : (
        <div style={{ width: 32, height: 48, background: 'var(--card)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--muted)' }}>?</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>{date}</p>
      </div>
    </div>
  )
}

export function History() {
  const { data: history = [] } = useDrawHistory()

  if (history.length === 0) return null

  return (
    <section>
      <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>抽取历史</h3>
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 200, overflowY: 'auto' }}>
        {history.map((item) => (
          <HistoryRow key={item.id} movieId={item.movie_id} drawnAt={item.drawn_at} />
        ))}
      </div>
    </section>
  )
}
