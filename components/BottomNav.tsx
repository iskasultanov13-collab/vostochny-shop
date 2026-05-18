'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

const navItems = [
  { href: '/', label: 'Каталог', icon: (a: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <rect x="3" y="3" width="8" height="8" rx="2" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" fill={a ? 'rgba(245,245,240,0.1)' : 'none'} />
      <rect x="13" y="3" width="8" height="8" rx="2" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" fill={a ? 'rgba(245,245,240,0.1)' : 'none'} />
      <rect x="3" y="13" width="8" height="8" rx="2" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" fill={a ? 'rgba(245,245,240,0.1)' : 'none'} />
      <rect x="13" y="13" width="8" height="8" rx="2" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" fill={a ? 'rgba(245,245,240,0.1)' : 'none'} />
    </svg>
  )},
  { href: '/favorites', label: 'Избранное', icon: (a: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={a ? '#c41e1e' : '#4a4a45'} strokeWidth="1.5" fill={a ? '#8b1a1a' : 'none'} />
    </svg>
  )},
  { href: '/profile', label: 'Профиль', icon: (a: boolean) => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" fill={a ? 'rgba(245,245,240,0.1)' : 'none'} />
      <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={a ? '#f5f5f0' : '#4a4a45'} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )},
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
if (pathname.startsWith('/product')) return null
  
console.log('pathname:', pathname)
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      <nav className="nav-blur px-2 py-2">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {navItems.map(item => {
           const isActive = item.label === 'Каталог' 
  ? pathname === '/'
  : item.label === 'Избранное'
  ? pathname.includes('favorites')
  : pathname.includes('profile')
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors">
                <div className="relative">
                  {item.icon(isActive)}
                  {isActive && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                </div>
                <span className={cn('text-[10px] tracking-widest uppercase font-body transition-colors', isActive ? 'text-white' : 'text-white-faint')}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
