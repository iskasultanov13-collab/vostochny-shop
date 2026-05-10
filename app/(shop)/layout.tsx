import { BottomNav } from '@/components/BottomNav'
import { AppProvider } from '@/components/AppProvider'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <main className="relative">{children}</main>
      <BottomNav />
    </AppProvider>
  )
}