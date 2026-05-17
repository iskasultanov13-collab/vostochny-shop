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
    case 'SALE': return 'bg-white text-black'
    case 'ARCHIVE': return 'bg-white/10 text-white border border-white/20'
    case 'LEGIT': return 'bg-crimson text-white'
    case 'NEW': return 'bg-white text-black border border-black/20'
    case 'ПРОДАНО': return 'bg-white-faint text-white-dim'
    default: return ''
  }
}'


export function getTelegramOrderLink(productTitle: string, price: number): string {
  const manager = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'
  const message = encodeURIComponent(`Привет! Хочу заказать: ${productTitle}\nЦена: ${formatPrice(price)}`)
  return `https://t.me/${manager}?text=${message}`
}
