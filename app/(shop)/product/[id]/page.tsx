import { getProductById } from '@/lib/products'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from './ProductDetailClient'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
