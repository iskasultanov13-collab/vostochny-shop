import { getProducts } from '@/lib/products'
import { HomeClient } from './HomeClient'

export const revalidate = 30

export default async function HomePage() {
  const products = await getProducts()
  return <HomeClient products={products} />
}