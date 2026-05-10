'use client'

import { useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { addFavorite, removeFavorite } from '@/lib/products'

export function useFavorites() {
  const { telegramUser, favorites, addFavoriteLocal, removeFavoriteLocal, isFavorite } = useAppStore()

  const toggleFavorite = useCallback(async (productId: string) => {
    if (!telegramUser) return
    const userId = String(telegramUser.id)
    if (isFavorite(productId)) {
      removeFavoriteLocal(productId)
      await removeFavorite(userId, productId)
    } else {
      addFavoriteLocal(productId)
      await addFavorite(userId, productId)
    }
  }, [telegramUser, isFavorite, addFavoriteLocal, removeFavoriteLocal])

  return { favorites, isFavorite, toggleFavorite }
}