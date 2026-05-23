import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BadgeType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)
}

export function getBadgeStyle(badge: BadgeType | null): { className: string; style: React.CSSProperties } {
  switch (badge) {
    case 'SALE': return { className: 'text-white', style: { background: 'rgba(220,38,38,0.75)', border: '1px solid rgba(220,38,38,0.5)' } }
    case 'ARCHIVE': return { className: 'text-yellow-100', style: { background: 'rgba(161,98,7,0.75)', border: '1px solid rgba(161,98,7,0.5)' } }
    case 'LEGIT': return { className: 'text-green-100', style: { background: 'rgba(21,128,61,0.75)', border: '1px solid rgba(21,128,61,0.5)' } }
    case 'NEW': return { className: 'text-blue-100', style: { background: 'rgba(29,78,216,0.75)', border: '1px solid rgba(29,78,216,0.5)' } }
    case 'ПРОДАНО': return { className: 'text-white/50', style: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' } }
    default: return { className: '', style: {} }
  }
}


export function getTelegramOrderLink(productTitle: string, price: number): string {
  const manager = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'
  const message = encodeURIComponent(`Привет! Хочу заказать: ${productTitle}\nЦена: ${formatPrice(price)}`)
  return `https://t.me/${manager}?text=${message}`
}
