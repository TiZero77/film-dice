// src/components/CardFlip/CardFlip.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useMovieStore } from '../../stores/useMovieStore'
import type { DrawnCard } from '../../types/movie'

const FAN_ANGLES = [-12, -6, 0, 6, 12]

export function CardFlip() {
  const { drawnCards, isDrawing, selectCard } = useMovieStore()

  if (!isDrawing || drawnCards.length === 0) return null

  return (
    <div className="relative flex items-center justify-center" style={{ height: 400, perspective: 1000 }}>
      <AnimatePresence>
        {drawnCards.map((card: DrawnCard, index: number) => (
          <motion.div
            key={card.movie.id}
            initial={{ y: 300, opacity: 0, rotate: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              rotate: FAN_ANGLES[index] ?? 0,
              x: (index - 2) * 90,
            }}
            exit={{ y: -100, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onClick={() => !card.isFlipped && selectCard(index)}
            className="absolute cursor-pointer"
            style={{ perspective: 800 }}
          >
            <motion.div
              animate={{ rotateY: card.isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-[160px] h-[240px]"
            >
              {/* 正面（背面纹理） */}
              <div
                className="absolute inset-0 rounded-lg border border-border flex items-center justify-center"
                style={{
                  backfaceVisibility: 'hidden',
                  background: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 18px,
                      rgba(212, 168, 83, 0.15) 18px,
                      rgba(212, 168, 83, 0.15) 20px
                    ),
                    linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)
                  `,
                }}
              >
                <div className="text-accent/60 text-3xl">🎬</div>
              </div>

              {/* 背面（海报） */}
              <div
                className="absolute inset-0 rounded-lg overflow-hidden"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {card.movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${card.movie.poster_path}`}
                    alt={card.movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-card flex items-center justify-center text-muted">
                    无海报
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">{card.movie.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
