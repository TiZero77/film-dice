// src/App.tsx
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

function AppContent() {
  const { isDark, filters, drawnCards, isDrawing, selectedCard, startDraw } = useMovieStore()
  const { data: movies = [], isLoading } = useDiscoverMovies(filters)
  const drawHistory = useDrawHistory()

  const handleDraw = () => {
    if (movies.length === 0) return

    // 排除已看过的电影
    const watchedIds = new Set(drawHistory.data?.map((h) => h.movie_id) ?? [])
    const available = movies.filter((m) => !watchedIds.has(m.id))

    if (available.length < 5) {
      alert('片池不足，请调整筛选条件')
      return
    }

    // 随机选 5 部
    const shuffled = [...available].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 5)

    startDraw(selected)

    // 记录抽取历史
    selected.forEach((movie) => drawHistory.add.mutate(movie.id))
  }

  return (
    <div className={isDark ? '' : 'light'}>
      <div className="min-h-screen bg-bg text-text transition-colors">
        <Header />
        <div className="flex h-[calc(100vh-65px)]">
          <Sidebar>
            <FilterBar />
            <div className="border-t border-border pt-4">
              <MyList />
            </div>
          </Sidebar>
          <main className="flex-1 flex flex-col items-center justify-center p-8 gap-8 overflow-y-auto">
            {/* 抽取按钮 */}
            {!isDrawing && !selectedCard && (
              <button
                onClick={handleDraw}
                disabled={isLoading || movies.length === 0}
                className="px-8 py-4 text-lg font-medium bg-accent text-bg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '加载中...' : '🎲 抽取电影'}
              </button>
            )}

            {/* 卡牌区 */}
            <CardFlip />

            {/* 详情区 */}
            {selectedCard && <MovieCard />}

            {/* 历史区 */}
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
