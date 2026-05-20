'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/Badge'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatPrice, getTelegramOrderLink, cn } from '@/utils'
import { useTelegram } from '@/hooks/useTelegram'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

export function ProductDetailClient({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0)
  const startX = useRef<number>(0)
  const router = useRouter()
  const { haptic } = useTelegram()
  const images = product.images || []
  const currentImage = images[activeImg]?.image_url

  const handleOrder = () => {
    haptic.success()
    window.open(getTelegramOrderLink(product.title, product.price), '_blank')
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) < 50) return
    if (diff > 0 && activeImg < images.length - 1) {
      setActiveImg(prev => prev + 1)
      haptic.light()
    } else if (diff < 0 && activeImg > 0) {
      setActiveImg(prev => prev - 1)
      haptic.light()
    }
  }

  return (
    <div className="min-h-screen bg-black page-transition">
      <div className="absolute top-4 left-4 z-50">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()}
          className="w-9 h-9 glass rounded-full flex items-center justify-center border border-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <FavoriteButton productId={product.id} size="md" />
      </div>

      {/* Image swiper */}
      <div
        className="relative w-full aspect-square bg-black-card overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {currentImage ? (
            <motion.div
              key={activeImg}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image src={currentImage} alt={product.title} fill className="object-cover" sizes="100vw" priority />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white-faint text-xs">НЕТ ФОТО</span>
            </div>
          )}
        </AnimatePresence>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={cn('transition-all duration-200 rounded-full', i === activeImg ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40')} />
            ))}
          </div>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-light rounded-full px-3 py-1">
            <span className="text-white text-xs font-mono">{activeImg + 1}/{images.length}</span>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-5 pt-6 pb-32">
        {product.badge && <div className="mb-2"><Badge badge={product.badge} /></div>}
        <h1 className="text-3xl text-white mb-3 leading-tight" style={{fontFamily:'Cormorant Garamond,serif'}}>{product.title}</h1>
        <p className={cn('text-2xl font-bold mb-6', product.sold ? 'text-white-faint line-through' : 'text-white')} style={{fontFamily:'Space Mono,monospace'}}>
          {formatPrice(product.price)}
        </p>

        <div className="h-px bg-black-border mb-6" />

        {/* Details */}
        {(product.brand || product.size || product.color || product.condition) && (
          <div className="glass-light rounded-2xl p-4 mb-6">
            <p className="text-[10px] text-white-faint tracking-widest uppercase mb-3">Детали</p>
            <div className="space-y-2">
              {product.brand && (
                <div className="flex justify-between">
                  <span className="text-white-faint text-xs">Бренд</span>
                  <span className="text-white text-xs font-medium">{product.brand}</span>
                </div>
              )}
              {product.size && (
                <div className="flex justify-between">
                  <span className="text-white-faint text-xs">Размер</span>
                  <span className="text-white text-xs font-medium">{product.size}</span>
                </div>
              )}
              {product.color && (
                <div className="flex justify-between">
                  <span className="text-white-faint text-xs">Цвет</span>
                  <span className="text-white text-xs font-medium">{product.color}</span>
                </div>
              )}
              {product.condition && (
                <div className="flex justify-between">
                  <span className="text-white-faint text-xs">Состояние</span>
                  <span className="text-white text-xs font-medium">{product.condition}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white-faint text-xs">Доставка</span>
                <span className="text-white text-xs font-medium">По договорённости</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white-faint text-xs">Оплата</span>
                <span className="text-white text-xs font-medium">СПБ / USDT</span>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <p className="text-[10px] text-white-faint tracking-widest uppercase mb-3">Описание</p>
            <p className="text-white-dim text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>
        )}
      </motion.div>

      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 nav-blur z-50"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
      >
        {product.sold ? (
          <button disabled className="w-full py-4 rounded-full bg-black-border text-white-faint text-xs font-semibold tracking-widest uppercase cursor-not-allowed">
            Продано
          </button>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleOrder}
            className="w-full py-4 rounded-full bg-white text-black text-xs font-bold tracking-widest uppercase crimson-glow">
            Написать · Заказать
          </motion.button>
        )}
      </div>
    </div>
  )
}
