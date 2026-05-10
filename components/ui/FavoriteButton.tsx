'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '@/hooks/useFavorites'
import { useTelegram } from '@/hooks/useTelegram'
import { cn } from '@/utils'

interface FavoriteButtonProps { productId: string; size?: 'sm' | 'md'; className?: string }

export function FavoriteButton({ productId, size = 'sm', className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { haptic } = useTelegram()
  const fav = isFavorite(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    haptic.light()
    await toggleFavorite(productId)
  }

  return (
    <motion.button onClick={handleClick} whileTap={{ scale: 0.85 }} className={cn('glass-light rounded-full flex items-center justify-center transition-colors', size === 'sm' ? 'w-8 h-8' : 'w-10 h-10', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={fav ? 'filled' : 'empty'} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
          {fav ? (
            <svg viewBox="0 0 24 24" fill="#c41e1e" className="w-4 h-4">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" className="w-4 h-4">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}