'use client'

import { cn, getBadgeStyle } from '@/utils'
import type { BadgeType } from '@/types'

interface BadgeProps { badge: BadgeType; className?: string }

export function Badge({ badge, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase font-body', getBadgeStyle(badge), className)}>
      {badge}
    </span>
  )
}