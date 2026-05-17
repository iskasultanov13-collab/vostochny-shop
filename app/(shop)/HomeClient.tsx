'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { useAppStore } from '@/lib/store'
import type { Product } from '@/types'

type Section = 'all' | 'legit' | 'not-legit'

export function HomeClient({ products }: { products: Product[] }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [section, setSection] = useState<Section>('all')
  const manager = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'

  const filtered = products.filter(p => {
    if (section === 'legit') return p.badge === 'LEGIT'
    if (section === 'not-legit') return p.badge !== 'LEGIT'
    return true
  })

  const sectionLabel: string = ({
    all: 'Все вещи',
    legit: 'LEGIT',
    'not-legit': 'НЕ LEGIT',
  } as Record<Section, string>)[section]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-40 keffiyeh-diamond">
        <div className="glass border-b border-black-border px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo — кликабельный */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={() => { setSection('all'); setMenuOpen(false) }}
              className="cursor-pointer"
            >
              <h1 className="text-xl text-white leading-none tracking-widest" style={{fontFamily:'Cormorant Garamond,serif'}}>
                ВОСТОЧНЫЙ
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-px w-8 bg-crimson" />
                <span className="text-[10px] tracking-[0.3em] text-white-dim uppercase" style={{fontFamily:'Montserrat,sans-serif'}}>
                  SHOP
                </span>
                <div className="h-px w-8 bg-crimson" />
              </div>
            </motion.div>

            {/* Menu button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 rounded-full glass-light flex items-center justify-center border border-white/10"
            >
              <motion.div
                animate={menuOpen ? { rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1 items-center justify-center w-4"
              >
                {menuOpen ? (
                  <span className="text-white text-lg leading-none">×</span>
                ) : (
                  <>
                    <div className="w-3.5 h-px bg-white" />
                    <div className="w-3.5 h-px bg-white" />
                    <div className="w-3.5 h-px bg-white" />
                  </>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Dropdown menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="glass border-b border-black-border"
            >
              {[
                { label: 'Все вещи', value: 'all' as Section },
                { label: 'LEGIT', value: 'legit' as Section },
                { label: 'НЕ LEGIT', value: 'not-legit' as Section },
              ].map(item => (
                <button
                  key={item.value}
                  onClick={() => { setSection(item.value); setMenuOpen(false) }}
                  className="w-full px-5 py-4 flex items-center justify-between border-b border-black-border last:border-0"
                >
                  <span className={`text-sm tracking-widest uppercase ${section === item.value ? 'text-white font-semibold' : 'text-white-dim'}`}
                    style={{fontFamily:'Montserrat,sans-serif'}}>
                    {item.label}
                  </span>
                  {section === item.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-crimson" />
                  )}
                </button>
              ))}

              {/* Сотрудничество */}
              
                href={`https://t.me/${manager}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-5 py-4 flex items-center justify-between border-t border-black-border"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-sm tracking-widest uppercase text-white-dim" style={{fontFamily:'Montserrat,sans-serif'}}>
                  Сотрудничество
                </span>
                <span className="text-white-faint text-xs">↗</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Section label */}
      <motion.div
        key={section}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 mt-6 mb-4 flex items-center gap-3"
      >
        <div className="h-px flex-1 bg-black-border" />
        <span className="text-[10px] tracking-[0.3em] text-white-faint uppercase" style={{fontFamily:'Montserrat,sans-serif'}}>
          {sectionLabel}
        </span>
        <div className="h-px flex-1 bg-black-border" />
      </motion.div>

      {/* Product grid */}
      <div className="px-4 pb-28">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-3"
          >
            <div className="w-16 h-16 rounded-full glass-light flex items-center justify-center mb-2">
              <span className="text-2xl">🏺</span>
            </div>
            <p className="text-white-dim text-sm tracking-widest text-center">Скоро появятся вещи</p>
            <p className="text-white-faint text-xs tracking-wide text-center">Архив пополняется</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
