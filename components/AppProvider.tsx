'use client'

import { useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/lib/store'
import { getFavoriteIds } from '@/lib/products'
import { supabase } from '@/lib/supabase'
import { useTheme } from '@/hooks/useTheme'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isReady, telegramUser } = useTelegram()
  const { setFavorites } = useAppStore()
  useTheme()

  useEffect(() => {
    if (!isReady || !telegramUser) return

    const init = async () => {
      const userId = String(telegramUser.id)
      const ids = await getFavoriteIds(userId)
      setFavorites(ids)
      await supabase.from('analytics').insert({
        event: 'app_open',
        telegram_user_id: userId,
      })
    }

    init()
  }, [isReady, telegramUser, setFavorites])

  return <>{children}</>
}
