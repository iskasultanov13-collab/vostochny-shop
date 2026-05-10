import { supabase } from './supabase'
import type { Product, Favorite } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*, images:product_images(*)').eq('sold', false).order('created_at', { ascending: false })
  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data } = await supabase.from('products').select('*, images:product_images(*)').eq('id', id).single()
  return data
}

export async function getFavoritesByUser(telegramUserId: string): Promise<Favorite[]> {
  const { data } = await supabase.from('favorites').select('*, product:products(*, images:product_images(*))').eq('telegram_user_id', telegramUserId)
  return data || []
}

export async function getFavoriteIds(telegramUserId: string): Promise<string[]> {
  const { data } = await supabase.from('favorites').select('product_id').eq('telegram_user_id', telegramUserId)
  return data?.map(f => f.product_id) || []
}

export async function addFavorite(telegramUserId: string, productId: string): Promise<boolean> {
  const { error } = await supabase.from('favorites').insert({ telegram_user_id: telegramUserId, product_id: productId })
  return !error
}

export async function removeFavorite(telegramUserId: string, productId: string): Promise<boolean> {
  const { error } = await supabase.from('favorites').delete().eq('telegram_user_id', telegramUserId).eq('product_id', productId)
  return !error
}

export async function uploadProductImage(file: File, productId: string, index: number): Promise<string | null> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${productId}/${index}-${Date.now()}.${fileExt}`
  const { error } = await supabase.storage.from('product-images').upload(fileName, file)
  if (error) return null
  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function createProduct(productData: { title: string; description: string; price: number; badge: string | null }, imageUrls: string[]): Promise<Product | null> {
  const { data: product, error } = await supabase.from('products').insert({ ...productData, sold: false }).select().single()
  if (error || !product) return null
  return product
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  return !error
}

export async function markProductSold(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').update({ sold: true, badge: 'ПРОДАНО' }).eq('id', id)
  return !error
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data } = await supabase.from('products').select('*, images:product_images(*)').order('created_at', { ascending: false })
  return data || []
}