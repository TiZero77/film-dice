import { useWatchlist } from '../../hooks/useWatchlist'
import { useWatched } from '../../hooks/useWatched'
import { useMovieDetail } from '../../hooks/useMovies'

function MovieRow({ movieId, type }: { movieId: number; type: 'watchlist' | 'watched' }) {
  const { data: movie } = useMovieDetail(movieId)
  const watched = useWatched()
  const watchlist = useWatchlist()

  if (!movie) return null

  const handleRemove = () => {
    if (type === 'watchlist') watchlist.remove.mutate(movieId)
    else watched.remove.mutate(movieId)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      {movie.poster_path ? (
        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} style={{ width: 32, height: 48, objectFit: 'cover', borderRadius: 4 }} />
      ) : (
        <div style={{ width: 32, height: 48, background: 'var(--card)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--muted)' }}>?</div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</p>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>{movie.release_date?.slice(0, 4)}</p>
      </div>
      <button onClick={handleRemove} style={{ fontSize: 11, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
    </div>
  )
}

export function MyList() {
  const { data: watchlist = [] } = useWatchlist()
  const { data: watched = [] } = useWatched()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>
          想看 <span style={{ color: 'var(--accent)' }}>({watchlist.length})</span>
        </h3>
        {watchlist.length === 0 ? (
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>还没有想看的电影</p>
        ) : (
          watchlist.map((item) => <MovieRow key={item.id} movieId={item.movie_id} type="watchlist" />)
        )}
      </section>

      <section>
        <h3 style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)', marginBottom: 8 }}>
          已看 <span style={{ color: 'var(--accent)' }}>({watched.length})</span>
        </h3>
        {watched.length === 0 ? (
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>还没有看过的电影</p>
        ) : (
          watched.map((item) => <MovieRow key={item.id} movieId={item.movie_id} type="watched" />)
        )}
      </section>
    </div>
  )
}
