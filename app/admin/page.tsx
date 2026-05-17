'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllProductsAdmin, uploadProductImage, createProduct, updateProduct, deleteProduct, markProductSold } from '@/lib/products'
import { formatPrice, cn } from '@/utils'
import type { Product, BadgeType } from '@/types'

const BADGES: (BadgeType | 'none')[] = ['none', 'SALE', 'ARCHIVE', 'LEGIT', 'NEW', 'ПРОДАНО']

const emptyForm = {
  title: '',
  description: '',
  price: '',
  badge: 'none' as BadgeType | 'none',
  brand: '',
  size: '',
  color: '',
  condition: '',
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState<'list' | 'add'>('list')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin2024') {
      setAuthed(true)
      localStorage.setItem('vs_admin', '1')
    } else {
      setAuthError(true)
      setTimeout(() => setAuthError(false), 1500)
    }
  }

  useEffect(() => { if (localStorage.getItem('vs_admin') === '1') setAuthed(true) }, [])
  useEffect(() => { if (authed) loadProducts() }, [authed])

  const loadProducts = async () => {
    setLoading(true)
    const data = await getAllProductsAdmin()
    setProducts(data)
    setLoading(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      title: product.title,
      description: product.description || '',
      price: String(product.price),
      badge: product.badge || 'none',
      brand: product.brand || '',
      size: product.size || '',
      color: product.color || '',
      condition: product.condition || '',
    })
    setImageFiles([])
    setImagePreviews(product.images?.map(i => i.image_url) || [])
    setTab('add')
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setForm(emptyForm)
    setImageFiles([])
    setImagePreviews([])
    setTab('list')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImageFiles(prev => [...prev, ...files].slice(0, 6))
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))].slice(0, 6))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price) return
    setUploading(true)

    const productData = {
      title: form.title,
      description: form.description,
      price: parseFloat(form.price),
      badge: form.badge === 'none' ? null : form.badge as BadgeType,
      brand: form.brand || null,
      size: form.size || null,
      color: form.color || null,
      condition: form.condition || null,
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData)
        if (imageFiles.length > 0) {
          const { supabase } = await import('@/lib/supabase')
          await supabase.from('product_images').delete().eq('product_id', editingProduct.id)
          for (let i = 0; i < imageFiles.length; i++) {
            const url = await uploadProductImage(imageFiles[i], editingProduct.id, i)
            if (url) await supabase.from('product_images').insert({ product_id: editingProduct.id, image_url: url, display_order: i })
          }
        }
      } else {
        const product = await createProduct(productData, [])
        if (!product) throw new Error('Failed')
        if (imageFiles.length > 0) {
          const { supabase } = await import('@/lib/supabase')
          for (let i = 0; i < imageFiles.length; i++) {
            const url = await uploadProductImage(imageFiles[i], product.id, i)
            if (url) await supabase.from('product_images').insert({ product_id: product.id, image_url: url, display_order: i })
          }
        }
      }

      setEditingProduct(null)
      setForm(emptyForm)
      setImageFiles([])
      setImagePreviews([])
      setTab('list')
      await loadProducts()
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (!authed) return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-white mb-2" style={{fontFamily:'Cormorant Garamond,serif'}}>Admin</h1>
          <p className="text-white-faint text-xs" style={{fontFamily:'Space Mono,monospace'}}>ВОСТОЧНЫЙ SHOP</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <motion.input type="password" placeholder="Пароль" value={password}
            onChange={e => setPassword(e.target.value)}
            animate={authError ? { x: [-6,6,-4,4,0] } : {}}
            className={cn('w-full bg-black-card border rounded-2xl px-5 py-4 text-white text-sm outline-none transition-colors',
              authError ? 'border-crimson-bright' : 'border-black-border focus:border-white/30')} />
          <button type="submit" className="w-full py-4 rounded-full bg-white text-black text-xs font-bold tracking-widest uppercase">Войти</button>
        </form>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <header className="glass border-b border-black-border px-5 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl text-white" style={{fontFamily:'Cormorant Garamond,serif'}}>
              {editingProduct ? 'Редактировать' : 'Admin Panel'}
            </h1>
            <p className="text-white-faint text-[10px]" style={{fontFamily:'Space Mono,monospace'}}>ВОСТОЧНЫЙ SHOP</p>
          </div>
          <button onClick={() => { localStorage.removeItem('vs_admin'); setAuthed(false) }}
            className="text-white-faint text-xs tracking-widest uppercase">Выйти</button>
        </div>
        <div className="flex gap-2">
          {(['list','add'] as const).map(t => (
            <button key={t} onClick={() => { if(t === 'list') handleCancel(); else setTab(t) }}
              className={cn('px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all',
                tab === t ? 'bg-white text-black font-semibold' : 'bg-black-card text-white-faint border border-black-border')}>
              {t === 'list' ? `Товары (${products.length})` : editingProduct ? '✏️ Редактировать' : '+ Добавить'}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4 pb-10">
        <AnimatePresence mode="wait">
          {tab === 'add' ? (
            <motion.div key="add" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Images */}
                <div>
                  <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Фото (до 6)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-black-card border border-black-border">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => {
                          setImageFiles(p => p.filter((_,idx) => idx!==i))
                          setImagePreviews(p => p.filter((_,idx) => idx!==i))
                        }} className="absolute top-1 right-1 w-6 h-6 glass rounded-full flex items-center justify-center text-white text-xs">×</button>
                      </div>
                    ))}
                    {imagePreviews.length < 6 && (
                      <button type="button" onClick={() => fileRef.current?.click()}
                        className="aspect-square rounded-xl border border-dashed border-black-border flex items-center justify-center bg-black-card text-white-faint text-2xl">+</button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>

                {/* Title */}
                <div>
                  <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Название *</label>
                  <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                    placeholder="Supreme Box Logo Hoodie" required
                    className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                </div>

                {/* Brand + Size row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Бренд</label>
                    <input type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
                      placeholder="Supreme"
                      className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Размер</label>
                    <input type="text" value={form.size} onChange={e => setForm({...form, size: e.target.value})}
                      placeholder="L / XL / 42"
                      className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>

                {/* Color + Condition row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Цвет</label>
                    <input type="text" value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                      placeholder="Чёрный"
                      className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Состояние</label>
                    <input type="text" value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}
                      placeholder="9/10"
                      className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Цена (₽) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                    placeholder="15000" required min="0"
                    className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors" />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Описание</label>
                  <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="История вещи, дополнительные детали..." rows={3}
                    className="w-full bg-black-card border border-black-border rounded-2xl px-4 py-3 text-white text-sm outline-none focus:border-white/30 transition-colors resize-none" />
                </div>

                {/* Badge */}
                <div>
                  <label className="text-[10px] text-white-faint tracking-widest uppercase mb-2 block">Бейдж</label>
                  <div className="flex flex-wrap gap-2">
                    {BADGES.map(b => (
                      <button key={b} type="button" onClick={() => setForm({...form, badge: b as BadgeType | 'none'})}
                        className={cn('px-3 py-1.5 rounded-full text-xs tracking-widest uppercase border transition-all',
                          form.badge === b ? 'bg-white text-black border-white font-semibold' : 'bg-black-card text-white-faint border-black-border')}>
                        {b === 'none' ? 'Без бейджа' : b}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  {editingProduct && (
                    <button type="button" onClick={handleCancel}
                      className="flex-1 py-4 rounded-full border border-black-border text-white-faint text-xs font-bold tracking-widest uppercase">
                      Отмена
                    </button>
                  )}
                  <button type="submit" disabled={uploading}
                    className={cn('flex-1 py-4 rounded-full bg-white text-black text-xs font-bold tracking-widest uppercase',
                      uploading && 'opacity-50 cursor-not-allowed')}>
                    {uploading ? 'Сохраняем...' : editingProduct ? 'Сохранить' : 'Опубликовать'}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3 mt-2">
              {loading ? [...Array(3)].map((_,i) => (
                <div key={i} className="glass-light rounded-2xl p-4 flex gap-4">
                  <div className="w-16 h-16 skeleton rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 skeleton rounded-full w-3/4" />
                    <div className="h-3 skeleton rounded-full w-1/2" />
                  </div>
                </div>
              )) : products.length === 0 ? (
                <div className="text-center py-16"><p className="text-white-faint text-sm">Нет товаров</p></div>
              ) : products.map(product => (
                <motion.div key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="glass-light rounded-2xl border border-black-border overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black-card flex-shrink-0">
                      {product.images?.[0]?.image_url
                        ? <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><span className="text-white-faint text-xs">—</span></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{product.title}</p>
                      <p className="text-white-dim text-sm mt-0.5" style={{fontFamily:'Space Mono,monospace'}}>{formatPrice(product.price)}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {product.brand && <span className="text-[10px] text-white-faint">{product.brand}</span>}
                        {product.size && <span className="text-[10px] text-white-faint">· {product.size}</span>}
                        {product.badge && <span className="text-[10px] text-crimson tracking-widest">{product.badge}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-black-border flex">
                    <button onClick={() => handleEdit(product)}
                      className="flex-1 py-2.5 text-xs text-white-dim tracking-widest uppercase border-r border-black-border">
                      Изменить
                    </button>
                    {!product.sold && (
                      <button onClick={() => markProductSold(product.id).then(loadProducts)}
                        className="flex-1 py-2.5 text-xs text-white-dim tracking-widest uppercase border-r border-black-border">
                        Продано
                      </button>
                    )}
                    <button onClick={() => { if(confirm('Удалить?')) deleteProduct(product.id).then(loadProducts) }}
                      className="flex-1 py-2.5 text-xs text-crimson tracking-widest uppercase">
                      Удалить
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
