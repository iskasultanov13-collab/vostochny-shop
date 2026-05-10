'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { useAppStore } from '@/lib/store'
import { getFavoritesByUser } from '@/lib/products'
import type { Favorite } from '@/types'

export default function FavoritesPage() {
  const { telegramUser, favorites } = useAppStore()
  const [favProducts, setFavProducts] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!telegramUser) return
    const load = async () => {
      setLoading(true)
      const data = await getFavoritesByUser(String(telegramUser.id))
      setFavProducts(data)
      setLoading(false)
    }
    load()
  }, [telegramUser, favorites])

  return (
    <div className="min-h-screen bg-black page-transition">
      <header className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-[10px] text-white-faint font-body tracking-[0.3em] uppercase mb-1">Мои сохранённые</p>
          <h1 className="font-display text-3xl text-white">Избранное</h1>
        </motion.div>
      </header>
      <div className="px-4 pb-28">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-card">
                <div className="aspect-square skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-3 skeleton rounded-full w-3/4" />
                  <div className="h-3 skeleton rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : favProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-full glass-light flex items-center justify-center mb-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="#4a4a45" strokeWidth="1" className="w-7 h-7">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="text-white-dim text-sm font-body tracking-widest text-center">Нет сохранённых вещей</p>
            <p className="text-white-faint text-xs font-body tracking-wide text-center">Нажми ♡ на карточке</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favProducts.map((fav, i) => fav.product && <ProductCard key={fav.id} product={fav.product} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}