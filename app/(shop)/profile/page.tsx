'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { telegramUser, favorites } = useAppStore()
  const [daysWithUs, setDaysWithUs] = useState<number | null>(null)
  const manager = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!telegramUser) return
    const registerAndFetch = async () => {
      const userId = String(telegramUser.id)
      await supabase.from('users').upsert(
        { telegram_user_id: userId },
        { onConflict: 'telegram_user_id', ignoreDuplicates: true }
      )
      const { data } = await supabase
        .from('users')
        .select('first_seen')
        .eq('telegram_user_id', userId)
        .single()
      if (data?.first_seen) {
        const days = Math.floor((Date.now() - new Date(data.first_seen).getTime()) / (1000 * 60 * 60 * 24))
        setDaysWithUs(days)
      }
    }
    registerAndFetch()
  }, [telegramUser])

  return (
    <div className="min-h-screen bg-black page-transition">
      <div className="keffiyeh-diamond px-5 pt-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="flex flex-col items-center">
          <div
            className="w-24 h-24 rounded-full overflow-hidden mb-4 flex items-center justify-center border border-crimson/30"
            style={{background: 'linear-gradient(135deg, #1a0a0a 0%, #2a0a0a 50%, #141414 100%)'}}>
            <span className="text-white text-3xl font-bold" style={{fontFamily:'Unbounded, sans-serif'}}>
              {telegramUser?.first_name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <h1 className="text-2xl text-white mb-1 text-center" style={{fontFamily:'Unbounded, sans-serif'}}>
            {telegramUser?.first_name} {telegramUser?.last_name}
          </h1>
          {telegramUser?.username && (
            <p className="text-white-faint text-xs" style={{fontFamily:'Space Grotesk, sans-serif'}}>@{telegramUser.username}</p>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mx-4 -mt-4 glass rounded-2xl border border-black-border p-5">
        <div className="grid grid-cols-2 divide-x divide-black-border">
          <div className="flex flex-col items-center pr-4">
            <span className="text-4xl text-white" style={{fontFamily:'Unbounded, sans-serif'}}>{favorites.length}</span>
            <span className="text-[10px] text-white-faint tracking-widest uppercase mt-1" style={{fontFamily:'Outfit, sans-serif'}}>Избранных</span>
          </div>
          <div className="flex flex-col items-center pl-4">
            <span className="text-4xl text-white" style={{fontFamily:'Unbounded, sans-serif'}}>
              {daysWithUs !== null ? daysWithUs : '...'}
            </span>
            <span className="text-[10px] text-white-faint tracking-widest uppercase mt-1" style={{fontFamily:'Outfit, sans-serif'}}>Дней с нами</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="px-4 mt-6 space-y-2">

        <button
          onClick={() => window.open(`https://t.me/${manager}`, '_blank')}
          className="w-full glass-light rounded-2xl p-4 flex items-center justify-between border border-white/5 active:opacity-70 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-crimson/10 flex items-center justify-center">
              <i className="fa-brands fa-telegram text-white text-lg" />
            </div>
            <span className="text-white text-sm" style={{fontFamily:'Outfit, sans-serif'}}>Написать продавцу</span>
          </div>
          <span className="text-white-faint">›</span>
        </button>

        <button
          onClick={toggleTheme}
          className="w-full glass-light rounded-2xl p-4 flex items-center justify-between border border-white/5 active:opacity-70 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-crimson/10 flex items-center justify-center">
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} text-crimson text-base`} />
            </div>
            <div className="text-left">
              <p className="text-white text-sm" style={{fontFamily:'Outfit, sans-serif'}}>
                {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              </p>
              <p className="text-white-faint text-xs" style={{fontFamily:'Outfit, sans-serif'}}>
                Сейчас: {theme === 'dark' ? 'тёмная' : 'светлая'}
              </p>
            </div>
          </div>
          <i className="fa-solid fa-chevron-right text-white-faint text-xs" />
        </button>

      </motion.div>

      <div className="flex flex-col items-center mt-12 mb-28 gap-1">
        <span className="text-white-faint text-lg" style={{fontFamily:'Unbounded, sans-serif'}}>ВОСТОЧНЫЙ SHOP</span>
        <p className="text-white-faint text-[10px]" style={{fontFamily:'Space Grotesk, sans-serif'}}>ARCHIVE · LUXURY · DRIP</p>
      </div>
    </div>
  )
}
