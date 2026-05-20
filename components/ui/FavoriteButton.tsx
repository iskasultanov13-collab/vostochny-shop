'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '@/hooks/useFavorites'
import { useTelegram } from '@/hooks/useTelegram'
import { cn } from '@/utils'
import toast from 'react-hot-toast'

export function FavoriteButton({ productId, size = 'sm', className }: { productId: string; size?: 'sm' | 'md'; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { haptic } = useTelegram()
  const fav = isFavorite(productId)

  return (
    <motion.button whileTap={{ scale: 0.85 }}
      onClick={async e => {
        e.preventDefault()
        e.stopPropagation()
        haptic.light()
        await toggleFavorite(productId)
        if (fav) {
          toast('Убрано из избранного', { icon: '🤍' })
        } else {
          toast('Добавлено в избранное', { icon: '❤️' })
        }
      }}
      className={cn('glass-light rounded-full flex items-center justify-center transition-colors', size === 'sm' ? 'w-8 h-8' : 'w-10 h-10', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={fav ? 'filled' : 'empty'} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.15 }}>
          {fav ? <span className="text-crimson-bright text-base">♥</span> : <span className="text-white/50 text-base">♡</span>}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
