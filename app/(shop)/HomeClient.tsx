'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { useAppStore } from '@/lib/store'
import type { Product } from '@/types'

interface HomeClientProps { products: Product[] }

export function HomeClient({ products }: HomeClientProps) {
  const { telegramUser } = useAppStore()

  return (
    <div className="min-h-screen bg-black">
      <header className="sticky top-0 z-40 keffiyeh-diamond">
        <div className="glass border-b border-black-border px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display text-xl text-white leading-none tracking-widest">ВОСТОЧНЫЙ</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-px flex-1 bg-crimson w-8" />
                <span className="text-[10px] tracking-[0.3em] text-white-dim font-body uppercase">SHOP</span>
                <div className="h-px flex-1 bg-crimson w-8" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <Link href="/profile">
                <div className="w-9 h-9 rounded-full glass-light flex items-center justify-center border border-white/10 overflow-hidden">
                  {telegramUser?.photo_url ? (
                    <img src={telegramUser.photo_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white-dim text-sm font-semibold font-body">{telegramUser?.first_name?.[0] || '?'}</span>
                  )}
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mx-4 mt-4 px-4 py-3 rounded-xl glass-light border border-crimson/20">
        <p className="text-[11px] text-white-dim font-body tracking-widest uppercase text-center">
          <span className="text-crimson-bright mr-2">●</span>
          Архив редких вещей · Только оригиналы
          <span className="text-crimson-bright ml-2">●</span>
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} className="px-4 mt-6 mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-black-border" />
        <span className="text-[10px] tracking-[0.3em] text-white-faint font-body uppercase">Каталог</span>
        <div className="h-px flex-1 bg-black-border" />
      </motion.div>

      <div className="px-4 pb-28">
        {products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-16 h-16 rounded-full glass-light flex items-center justify-center mb-2">
              <span className="text-2xl">🏺</span>
            </div>
            <p className="text-white-dim text-sm font-body tracking-widest text-center">Скоро появятся вещи</p>
            <p className="text-white-faint text-xs font-body tracking-wide text-center">Архив пополняется</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}