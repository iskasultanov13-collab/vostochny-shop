'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatPrice, cn, getBadgeStyle } from '@/utils'
import type { Product } from '@/types'

interface ProductCardProps { product: Product; index?: number }

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const firstImage = product.images?.[0]?.image_url

  const BadgeEl = ({ badge }: { badge: NonNullable<typeof product.badge> }) => {
    const s = getBadgeStyle(badge)
    return (
      <span
        className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase', s.className)}
        style={{...s.style, fontFamily:'Outfit, sans-serif'}}
      >
        {badge}
      </span>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}>
      <Link href={`/product/${product.id}`} className="block">
        <div className={`product-card group ${product.sold ? 'opacity-60' : ''}`}>
          <div className="relative aspect-square overflow-hidden bg-black-card">
            {firstImage ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 skeleton" />}
                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black-card">
                <span className="text-white-faint text-xs tracking-widest" style={{fontFamily:'Outfit, sans-serif'}}>NO IMG</span>
              </div>
            )}

            {product.sold && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-2">
                <span className="text-white text-sm font-bold tracking-widest uppercase" style={{fontFamily:'Unbounded, sans-serif'}}>
                  ПРОДАНО
                </span>
              </div>
            )}

            {!product.sold && (product.badge || product.badge2) && (
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.badge && <BadgeEl badge={product.badge} />}
                {product.badge2 && <BadgeEl badge={product.badge2} />}
              </div>
            )}

            <div className="absolute top-2 right-2" onClick={e => e.preventDefault()}>
              <FavoriteButton productId={product.id} />
            </div>
          </div>

          <div className="p-3">
            <h3 className="text-white text-sm font-medium leading-tight truncate tracking-wide mb-1" style={{fontFamily:'Outfit, sans-serif'}}>
              {product.title}
            </h3>
            <p className={cn('text-sm font-semibold tracking-wide', product.sold ? 'text-white-faint line-through' : 'text-white')}
              style={{fontFamily:'Space Grotesk, sans-serif'}}>
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
