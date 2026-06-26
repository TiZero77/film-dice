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
    <div className="flex items-center gap-3 py-2">
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
          alt={movie.title}
          className="w-8 h-12 object-cover rounded"
        />
      ) : (
        <div className="w-8 h-12 bg-card rounded flex items-center justify-center text-xs text-muted">?</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{movie.title}</p>
        <p className="text-xs text-muted">{date}</p>
      </div>
    </div>
  )
}

export function History() {
  const { data: history = [] } = useDrawHistory()

  if (history.length === 0) return null

  return (
    <section>
      <h3 className="text-sm font-medium text-muted mb-2">抽取历史</h3>
      <div className="flex flex-col max-h-48 overflow-y-auto">
        {history.map((item) => (
          <HistoryRow key={item.id} movieId={item.movie_id} drawnAt={item.drawn_at} />
        ))}
      </div>
    </section>
  )
}
