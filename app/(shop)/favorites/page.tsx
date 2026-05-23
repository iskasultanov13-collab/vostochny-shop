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
    <div className="min-h-screen page-transition" style={{background:'var(--color-bg)'}}>
      <header className="px-5 pt-6 pb-4">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>
            Мои сохранённые
          </p>
          <h1 className="text-3xl" style={{color:'var(--color-text)', fontFamily:'Unbounded, sans-serif'}}>
            Избранное
          </h1>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-full glass-light flex items-center justify-center mb-2">
              <i className="fa-regular fa-heart text-2xl" style={{color:'var(--color-faint)'}} />
            </div>
            <p className="text-sm tracking-widest text-center" style={{color:'var(--color-muted)', fontFamily:'Outfit, sans-serif'}}>
              Нет сохранённых вещей
            </p>
            <p className="text-xs tracking-wide text-center" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>
              Нажми ♡ на карточке
            </p>
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
