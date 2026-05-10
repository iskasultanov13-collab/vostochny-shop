'use client'

import { useEffect } from 'react'
import { useTelegram } from '@/hooks/useTelegram'
import { useAppStore } from '@/lib/store'
import { getFavoriteIds } from '@/lib/products'

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isReady, telegramUser } = useTelegram()
  const { setFavorites } = useAppStore()

  useEffect(() => {
    if (!isReady || !telegramUser) return
    getFavoriteIds(String(telegramUser.id)).then(setFavorites)
  }, [isReady, telegramUser, setFavorites])

  return <>{children}</>
}