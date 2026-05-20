'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { FavoriteButton } from '@/components/ui/FavoriteButton'
import { formatPrice, cn } from '@/utils'
import type { Product } from '@/types'

interface ProductCardProps { product: Product; index?: number }

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const firstImage = product.images?.[0]?.image_url

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}>
      <Link href={`/product/${product.id}`} className="block">
        <div className="product-card group">
          <div className="relative aspect-square overflow-hidden bg-black-card">
            {firstImage ? (
              <>
                {!imgLoaded && <div className="absolute inset-0 skeleton" />}
                <Image src={firstImage} alt={product.title} fill className={`object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} onLoad={() => setImgLoaded(true)} sizes="(max-width: 768px) 50vw, 33vw" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black-card">
                <span className="text-white-faint text-xs font-mono tracking-widest">NO IMG</span>
              </div>
            )}
            {product.sold && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white-dim text-xs font-semibold tracking-widest uppercase font-body">Продано</span>
              </div>
            )}
            {product.badge && !product.sold && <div className="absolute top-2 left-2"><Badge badge={product.badge} /></div>}
            <div className="absolute top-2 right-2" onClick={e => e.preventDefault()}>
              <FavoriteButton productId={product.id} />
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-white text-sm font-medium leading-tight truncate font-body tracking-wide mb-1">{product.title}</h3>
            <p className={`text-sm font-semibold tracking-wide font-mono ${product.sold ? 'text-white-faint line-through' : 'text-white'}`}>{formatPrice(product.price)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
