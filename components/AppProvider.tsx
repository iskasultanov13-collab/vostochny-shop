'use client'

import { useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/lib/store'
import { getFavoriteIds } from '@/lib/products'
import { supabase } from '@/lib/supabase'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isReady, telegramUser } = useTelegram()
  const { setFavorites } = useAppStore()

  useEffect(() => {
    if (!isReady || !telegramUser) return

    const init = async () => {
      const userId = String(telegramUser.id)

      // Загружаем избранное
      const ids = await getFavoriteIds(userId)
      setFavorites(ids)

      // Трекаем открытие
      await supabase.from('analytics').insert({
        event: 'app_open',
        telegram_user_id: userId,
      })
    }

    init()
  }, [isReady, telegramUser, setFavorites])

  return <>{children}</>
}
