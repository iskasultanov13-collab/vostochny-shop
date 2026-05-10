'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import type { TelegramUser } from '@/types'

export function useTelegram() {
  const [isReady, setIsReady] = useState(false)
  const [tg, setTg] = useState<any>(null)
  const { setTelegramUser, telegramUser } = useAppStore()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const webApp = (window as any).Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
      webApp.setHeaderColor('#0a0a0a')
      webApp.setBackgroundColor('#0a0a0a')
      setTg(webApp)
      const user = webApp.initDataUnsafe?.user
      if (user) setTelegramUser(user as TelegramUser)
      else setTelegramUser({ id: 123456789, first_name: 'Test', username: 'testuser' })
    } else {
      setTelegramUser({ id: 123456789, first_name: 'Test', username: 'testuser' })
    }
    setIsReady(true)
  }, [setTelegramUser])

  const haptic = {
    light: () => tg?.HapticFeedback?.impactOccurred('light'),
    medium: () => tg?.HapticFeedback?.impactOccurred('medium'),
    success: () => tg?.HapticFeedback?.notificationOccurred('success'),
    error: () => tg?.HapticFeedback?.notificationOccurred('error'),
  }

  return { tg, isReady, telegramUser, haptic }
}