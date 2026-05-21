export interface Product {
  id: string
  title: string
  description: string | null
  price: number
  badge: BadgeType | null
  badge2: BadgeType | null
  sold: boolean
  brand: string | null
  size: string | null
  color: string | null
  condition: string | null
  created_at: string
  images?: ProductImage[]
}

export type BadgeType = 'SALE' | 'ARCHIVE' | 'LEGIT' | 'NEW' | 'ПРОДАНО'

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  display_order: number
}

export interface Favorite {
  id: string
  telegram_user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  language_code?: string
}
