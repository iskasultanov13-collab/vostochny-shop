'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

const navItems = [
  { href: '/', label: 'Каталог', icon: 'fa-solid fa-border-all' },
  { href: '/favorites', label: 'Избранное', icon: 'fa-solid fa-heart' },
  { href: '/profile', label: 'Профиль', icon: 'fa-solid fa-user' },
]

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null
  if (pathname.startsWith('/product')) return null

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
              <Link key={item.href} href={item.href} prefetch={false}
                className="flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-colors">
                <div className="relative">
                  <i className={`${item.icon} text-lg transition-colors`}
                    style={{color: isActive ? item.label === 'Избранное' ? 'var(--color-crimson-bright)' : 'var(--color-text)' : 'var(--color-faint)'}} />
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{background:'var(--color-text)'}}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] tracking-widest uppercase transition-colors"
                  style={{color: isActive ? 'var(--color-text)' : 'var(--color-faint)', fontFamily:'Outfit, sans-serif'}}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
