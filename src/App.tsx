// src/App.tsx
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMovieStore } from './stores/useMovieStore'
import { useDiscoverMovies } from './hooks/useMovies'
import { useDrawHistory } from './hooks/useDrawHistory'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'
import { FilterBar } from './components/FilterBar/FilterBar'
import { CardFlip } from './components/CardFlip/CardFlip'
import { MovieCard } from './components/MovieCard/MovieCard'
import { MyList } from './components/MyList/MyList'
import { History } from './components/History/History'

const queryClient = new QueryClient()

function MoviePool({ movies }: { movies: { id: number; title: string; vote_average: number; release_date: string }[] }) {
  const [showAll, setShowAll] = useState(false)
  const displayed = showAll ? movies : movies.slice(0, 20)

  return (
    <div style={{ width: '100%', maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 500, color: 'var(--muted)' }}>
          片池共 {movies.length} 部电影
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {showAll ? '收起' : '展开全部'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: showAll ? 400 : 'none', overflowY: 'auto' }}>
        {displayed.map((movie, i) => (
          <div
            key={movie.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 8px',
              borderRadius: 6,
              background: i % 2 === 0 ? 'var(--card)' : 'transparent',
            }}
          >
            <span style={{ fontSize: 11, color: 'var(--muted)', width: 24, textAlign: 'right' }}>{i + 1}</span>
            <span style={{ fontSize: 13, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)' }}>⭐ {movie.vote_average.toFixed(1)}</span>
            <span style={{ fontSize: 11, color: 'var(--muted)' }}>{movie.release_date?.slice(0, 4)}</span>
          </div>
        ))}
      </div>
      {!showAll && movies.length > 20 && (
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, textAlign: 'center' }}>
          还有 {movies.length - 20} 部...
        </p>
      )}
    </div>
  )
}

function AppContent() {
  const { isDark, filters, isDrawing, selectedCard, startDraw } = useMovieStore()
  const { data: movies = [], isLoading } = useDiscoverMovies(filters)
  const drawHistory = useDrawHistory()
  const [showPool, setShowPool] = useState(false)

  const handleDraw = () => {
    if (movies.length === 0) return
    const watchedIds = new Set(drawHistory.data?.map((h) => h.movie_id) ?? [])
    const available = movies.filter((m) => !watchedIds.has(m.id))
    if (available.length < 5) {
      alert('片池不足，请调整筛选条件')
      return
    }
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5)
    startDraw(selected)
    selected.forEach((movie) => drawHistory.add.mutate(movie.id))
  }

  return (
    <div className={isDark ? '' : 'light'}>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', transition: 'background 0.3s, color 0.3s' }}>
        <Header />
        <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
          <Sidebar>
            <FilterBar />
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <MyList />
            </div>
          </Sidebar>
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 32, overflowY: 'auto', minWidth: 0, gap: 24 }}>
            {!isDrawing && !selectedCard && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  onClick={handleDraw}
                  disabled={isLoading || movies.length === 0}
                  style={{
                    padding: '16px 32px',
                    fontSize: 18,
                    fontWeight: 500,
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    border: 'none',
                    borderRadius: 12,
                    cursor: isLoading || movies.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: isLoading || movies.length === 0 ? 0.5 : 1,
                  }}
                >
                  {isLoading ? '加载中...' : '🎲 抽取电影'}
                </button>
                <button
                  onClick={() => setShowPool(!showPool)}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    background: 'transparent',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  {showPool ? '隐藏片池' : '查看片池'}
                </button>
              </div>
            )}

            {showPool && !isDrawing && !selectedCard && <MoviePool movies={movies} />}

            <CardFlip />

            {selectedCard && <MovieCard />}

            {!isDrawing && !selectedCard && <History />}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  )
}
