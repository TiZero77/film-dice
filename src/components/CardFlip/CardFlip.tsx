// src/components/CardFlip/CardFlip.tsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMovieStore } from '../../stores/useMovieStore'

export function CardFlip() {
  const { drawnCards, isDrawing, selectCard } = useMovieStore()
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  // 每次抽新卡时重置翻转状态
  useEffect(() => {
    setFlippedIndex(null)
  }, [drawnCards])

  if (!isDrawing || drawnCards.length === 0) return null

  const handleFlip = (index: number) => {
    if (flippedIndex !== null) return
    setFlippedIndex(index)
    setTimeout(() => {
      selectCard(index)
    }, 700)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '40px 0' }}>
      {drawnCards.map((card, index) => {
        const isFlipped = flippedIndex === index
        return (
          <motion.div
            key={card.movie.id}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            onClick={() => handleFlip(index)}
            style={{
              width: 140,
              height: 210,
              cursor: flippedIndex === null ? 'pointer' : 'default',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.6s ease',
                transform: isFlipped ? 'rotateY(180deg)' : 'none',
              }}
            >
              {/* 正面（卡背） */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent, transparent 16px, rgba(212,168,83,0.12) 16px, rgba(212,168,83,0.12) 18px),
                    linear-gradient(135deg, #1a1a1a, #2a2a2a)
                  `,
                }}
              >
                <span style={{ fontSize: 32, opacity: 0.5 }}>🎬</span>
              </div>

              {/* 背面（海报） */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {card.movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w342${card.movie.poster_path}`}
                    alt={card.movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                    无海报
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                  <p style={{ color: '#fff', fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {card.movie.title}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
