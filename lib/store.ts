import { create } from 'zustand'
import type { TelegramUser } from '@/types'

interface AppStore {
  telegramUser: TelegramUser | null
  setTelegramUser: (user: TelegramUser | null) => void
  favorites: string[]
  setFavorites: (ids: string[]) => void
  addFavoriteLocal: (productId: string) => void
  removeFavoriteLocal: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

export const useAppStore = create<AppStore>((set, get) => ({
  telegramUser: null,
  setTelegramUser: user => set({ telegramUser: user }),
  favorites: [],
  setFavorites: ids => set({ favorites: ids }),
  addFavoriteLocal: productId => set(state => ({ favorites: [...state.favorites, productId] })),
  removeFavoriteLocal: productId => set(state => ({ favorites: state.favorites.filter(id => id !== productId) })),
  isFavorite: productId => get().favorites.includes(productId),
}))