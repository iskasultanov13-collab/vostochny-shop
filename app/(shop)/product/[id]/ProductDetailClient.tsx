'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatPrice, getTelegramOrderLink, cn } from '@/utils'
import { useTelegram } from '@/hooks/useTelegram'
import type { Product } from '@/types'

interface ProductDetailClientProps { product: Product }

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [activeImg, setActiveImg] = useState(0)
  const router = useRouter()
  const { haptic } = useTelegram()
  const images = product.images || []
  const currentImage = images[activeImg]?.image_url

  const handleOrder = () => {
    haptic.success()
    window.open(getTelegramOrderLink(product.title, product.price), '_blank')
  }

  return (
    <div className="min-h-screen bg-black page-transition">
      <div className="absolute top-4 left-4 z-50">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()} className="w-9 h-9 glass rounded-full flex items-center justify-center border border-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <FavoriteButton productId={product.id} size="md" />
      </div>

      <div className="relative w-full aspect-square bg-black-card overflow-hidden">
        <AnimatePresence mode="wait">
          {currentImage ? (
            <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
              <Image src={currentImage} alt={product.title} fill className="object-cover" sizes="100vw" priority />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white-faint text-xs font-mono tracking-widest">NO IMAGE</span>
            </div>
          )}
        </AnimatePresence>
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`transition-all duration-200 rounded-full ${i === activeImg ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'}`} />
            ))}
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="px-5 pt-6 pb-32">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            {product.badge && <div className="mb-2"><Badge badge={product.badge} /></div>}
            <h1 className="font-display text-3xl text-white leading-tight">{product.title}</h1>
          </div>
        </div>

        <div className="mb-6">
          <p className={`font-mono text-2xl font-bold tracking-wide ${product.sold ? 'text-white-faint line-through' : 'text-white'}`}>{formatPrice(product.price)}</p>
          {product.sold && <p className="text-white-dim text-xs font-body tracking-widest mt-1 uppercase">Продано</p>}
        </div>

        <div className="h-px bg-black-border mb-6" />

        {product.description && (
          <div className="mb-6">
            <p className="text-[10px] text-white-faint font-body tracking-widest uppercase mb-3">Описание</p>
            <p className="text-white-dim text-sm font-body leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}

        <div className="glass-light rounded-2xl p-4 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white-faint text-xs font-body tracking-wide">Состояние</span>
              <span className="text-white text-xs font-body font-medium">Оригинал</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-faint text-xs font-body tracking-wide">Доставка</span>
              <span className="text-white text-xs font-body font-medium">По договорённости</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white-faint text-xs font-body tracking-wide">Оплата</span>
              <span className="text-white text-xs font-body font-medium">СПБ / USDT</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 nav-blur z-50"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
      >
        {product.sold ? (
          <button disabled className="w-full py-4 rounded-full bg-black-border text-white-faint text-xs font-body font-semibold tracking-widest uppercase cursor-not-allowed">Продано</button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleOrder} className="w-full py-4 rounded-full bg-white text-black text-xs font-body font-bold tracking-widest uppercase crimson-glow">
            Написать · Заказать
          </motion.button>
        )}
      </div>
    </div>
  )
}
