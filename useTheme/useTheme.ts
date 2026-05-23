'use client'

import { useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    // Берём сохранённую тему или системную
    const saved = localStorage.getItem('vs_theme') as Theme | null
    if (saved) {
      applyTheme(saved)
      setTheme(saved)
    } else {
      const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      applyTheme(system)
      setTheme(system)
    }

    // Слушаем изменения системной темы
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('vs_theme')) {
        const t = e.matches ? 'light' : 'dark'
        applyTheme(t)
        setTheme(t)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute('data-theme', t)
  }

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
    localStorage.setItem('vs_theme', next)
  }

  const resetToSystem = () => {
    localStorage.removeItem('vs_theme')
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    applyTheme(system)
    setTheme(system)
  }

  return { theme, toggleTheme, resetToSystem }
}
