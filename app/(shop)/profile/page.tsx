'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { telegramUser, favorites } = useAppStore()
  const [firstSeen, setFirstSeen] = useState<string | null>(null)

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
        const date = new Date(data.first_seen)
        const formatted = date.toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
        setFirstSeen(formatted)
      }
    }

    registerAndFetch()
  }, [telegramUser])

  return (
    <div className="min-h-screen bg-black page-transition">
      <div className="keffiyeh-diamond px-5 pt-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full glass border border-white/10 overflow-hidden mb-4 flex items-center justify-center bg-black-card">
            <span className="text-white text-3xl" style={{fontFamily:'Unbounded, sans-serif'}}>
              {telegramUser?.first_name?.[0] || '?'}
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
            <span className="text-sm text-white text-center leading-tight" style={{fontFamily:'Space Grotesk, sans-serif'}}>
              {firstSeen || '...'}
            </span>
            <span className="text-[10px] text-white-faint tracking-widest uppercase mt-1" style={{fontFamily:'Outfit, sans-serif'}}>С нами с</span>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="px-4 mt-6 space-y-2">
        <Link href="/favorites">
          <div className="glass-light rounded-2xl p-4 flex items-center justify-between border border-white/5 active:opacity-70 transition-opacity">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-crimson/10 flex items-center justify-center">
                <span className="text-crimson text-base">♥</span>
              </div>
              <span className="text-white text-sm" style={{fontFamily:'Outfit, sans-serif'}}>Избранное</span>
            </div>
            <span className="text-white-faint">›</span>
          </div>
        </Link>
      </motion.div>

      <div className="flex flex-col items-center mt-12 mb-28 gap-1">
        <span className="text-white-faint text-lg" style={{fontFamily:'Unbounded, sans-serif'}}>ВОСТОЧНЫЙ SHOP</span>
        <p className="text-white-faint text-[10px]" style={{fontFamily:'Space Grotesk, sans-serif'}}>ARCHIVE · LUXURY · DRIP</p>
      </div>
    </div>
  )
}
