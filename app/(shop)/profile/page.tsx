'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useAppStore } from '@/lib/store'

export default function ProfilePage() {
  const { telegramUser, favorites } = useAppStore()

  return (
    <div className="min-h-screen bg-black page-transition">
      <div className="keffiyeh-diamond px-5 pt-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full glass border border-white/10 overflow-hidden">
              {telegramUser?.photo_url ? (
                <img src={telegramUser.photo_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-black-card">
                  <span className="text-white text-3xl font-display">{telegramUser?.first_name?.[0] || '?'}</span>
                </div>
              )}
            </div>
          </div>
          <h1 className="font-display text-2xl text-white mb-1">{telegramUser?.first_name} {telegramUser?.last_name}</h1>
          {telegramUser?.username && <p className="text-white-faint text-xs font-mono tracking-widest">@{telegramUser.username}</p>}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="mx-4 -mt-4 glass rounded-2xl border border-black-border p-5">
        <div className="grid grid-cols-2 divide-x divide-black-border">
          <div className="flex flex-col items-center pr-4">
            <span className="font-display text-4xl text-white">{favorites.length}</span>
            <span className="text-[10px] text-white-faint font-body tracking-widest uppercase mt-1">Избранных</span>
          </div>
          <div className="flex flex-col items-center pl-4">
            <span className="font-display text-4xl text-crimson-bright">∞</span>
            <span className="text-[10px] text-white-faint font-body tracking-widest uppercase mt-1">Архив</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="px-4 mt-6 space-y-2">
        <Link href="/favorites">
          <div className="glass-light rounded-2xl p-4 flex items-center justify-between border border-white/5 active:opacity-70 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-crimson/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="#8b1a1a" className="w-4 h-4">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="text-white text-sm font-body tracking-wide">Избранное</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a4a45" strokeWidth="1.5" className="w-4 h-4">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center mt-12 mb-28 gap-1">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-black-border" />
          <span className="font-display text-white-faint text-lg italic">ВОСТОЧНЫЙ SHOP</span>
          <div className="h-px w-8 bg-black-border" />
        </div>
        <p className="text-white-faint text-[10px] font-mono tracking-widest">ARCHIVE · LUXURY · DRIP</p>
      </motion.div>
    </div>
  )
}