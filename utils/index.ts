import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BadgeType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)
}

export function getBadgeStyle(badge: BadgeType | null): string {
  switch (badge) {
    case 'SALE': return 'bg-red-600/70 text-white border border-red-500/40'
    case 'ARCHIVE': return 'bg-yellow-600/70 text-yellow-100 border border-yellow-500/40'
    case 'LEGIT': return 'bg-green-700/70 text-green-100 border border-green-600/40'
    case 'NEW': return 'bg-blue-700/70 text-blue-100 border border-blue-600/40'
    case 'ПРОДАНО': return 'bg-black/60 text-white-faint border border-white/10'
    default: return ''
  }
}


export function getTelegramOrderLink(productTitle: string, price: number): string {
  const manager = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'
  const message = encodeURIComponent(`Привет! Хочу заказать: ${productTitle}\nЦена: ${formatPrice(price)}`)
  return `https://t.me/${manager}?text=${message}`
}
