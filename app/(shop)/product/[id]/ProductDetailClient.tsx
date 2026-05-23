'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatPrice, getTelegramOrderLink, cn, getBadgeStyle } from '@/utils'
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
    toast('Открываем чат с продавцом...', { icon: '💬' })
    setTimeout(() => {
      window.open(getTelegramOrderLink(product.title, product.price), '_blank')
    }, 500)
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

  const BadgeEl = ({ badge }: { badge: NonNullable<typeof product.badge> }) => {
    const s = getBadgeStyle(badge)
    return (
      <span
        className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase', s.className)}
        style={{...s.style, fontFamily:'Outfit, sans-serif'}}
      >
        {badge}
      </span>
    )
  }

  return (
    <div className="min-h-screen page-transition" style={{background:'var(--color-bg)'}}>
      <div className="absolute top-4 left-4 z-50">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.back()}
          className="w-9 h-9 glass rounded-full flex items-center justify-center"
          style={{border:'1px solid rgba(var(--glass-border),0.1)'}}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="w-4 h-4"
            stroke="var(--color-text)">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <FavoriteButton productId={product.id} size="md" />
      </div>

      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{background:'var(--color-card)'}}
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
              <span className="text-xs" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>НЕТ ФОТО</span>
            </div>
          )}
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={cn('transition-all duration-200 rounded-full', i === activeImg ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40')} />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-light rounded-full px-3 py-1">
            <span className="text-xs" style={{color:'var(--color-text)', fontFamily:'Space Grotesk, sans-serif'}}>{activeImg + 1}/{images.length}</span>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="px-5 pt-6 pb-32">
        {(product.badge || product.badge2) && (
          <div className="flex gap-2 mb-3">
            {product.badge && <BadgeEl badge={product.badge} />}
            {product.badge2 && <BadgeEl badge={product.badge2} />}
          </div>
        )}

        <h1 className="text-2xl mb-3 leading-tight" style={{color:'var(--color-text)', fontFamily:'Unbounded, sans-serif'}}>
          {product.title}
        </h1>

        <p className="text-2xl font-bold mb-6"
          style={{
            color: product.sold ? 'var(--color-faint)' : 'var(--color-text)',
            textDecoration: product.sold ? 'line-through' : 'none',
            fontFamily:'Space Grotesk, sans-serif'
          }}>
          {formatPrice(product.price)}
        </p>

        <div className="h-px mb-6" style={{background:'var(--color-border)'}} />

        {(product.brand || product.size || product.color || product.condition) && (
          <div className="glass-light rounded-2xl p-4 mb-6" style={{border:'1px solid var(--color-border)'}}>
            <p className="text-[10px] tracking-widest uppercase mb-3" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>Детали</p>
            <div className="space-y-2">
              {[
                { label: 'Бренд', value: product.brand },
                { label: 'Размер', value: product.size },
                { label: 'Цвет', value: product.color },
                { label: 'Состояние', value: product.condition },
                { label: 'Доставка', value: 'По договорённости' },
                { label: 'Оплата', value: 'СПБ / USDT' },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-xs" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>{row.label}</span>
                  <span className="text-xs font-medium" style={{color:'var(--color-text)', fontFamily:'Space Grotesk, sans-serif'}}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {product.description && (
          <div className="mb-6">
            <p className="text-[10px] tracking-widest uppercase mb-3" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>Описание</p>
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{color:'var(--color-muted)', fontFamily:'Outfit, sans-serif'}}>{product.description}</p>
          </div>
        )}
      </motion.div>

      <div
        className="fixed bottom-0 left-0 right-0 px-5 pt-4 nav-blur z-50"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}
      >
        {product.sold ? (
          <div className="space-y-3">
            <p className="text-xs text-center tracking-wide" style={{color:'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>
              Если хочешь новый завоз этой шмотки, пиши менеджеру ↓
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleOrder}
              className="w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{background:'var(--color-card)', border:'1px solid var(--color-border)', color:'var(--color-muted)', fontFamily:'Outfit, sans-serif'}}
            >
              Написать менеджеру
            </motion.button>
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleOrder}
            className="w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase crimson-glow"
            style={{background:'var(--color-text)', color:'var(--color-bg)', fontFamily:'Outfit, sans-serif'}}>
            Написать · Заказать
          </motion.button>
        )}
      </div>
    </div>
  )
}
