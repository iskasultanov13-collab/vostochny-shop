import { BottomNav } from '@/components/BottomNav'
import { AppProvider } from '@/components/AppProvider'
import { Toaster } from 'react-hot-toast'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <main>{children}</main>
      <BottomNav />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#141414',
            color: '#f5f5f0',
            border: '1px solid #1e1e1e',
            borderRadius: '100px',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'Montserrat, sans-serif',
            padding: '12px 20px',
          },
          success: {
            iconTheme: {
              primary: '#8b1a1a',
              secondary: '#f5f5f0',
            },
          },
        }}
      />
    </AppProvider>
  )
}
