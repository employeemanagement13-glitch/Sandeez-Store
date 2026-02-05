'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import DragDropUpload from '@/components/admin/DragDropUpload'

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<any[]>([])

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        base_price: '',
        gender: '',
        category_id: '',
        is_featured: false,
        stock_quantity: 0
    })

    const [images, setImages] = useState<string[]>([])
    const [variants, setVariants] = useState<{ size: string, color: string, stock: number }[]>([])

    useEffect(() => {
        fetch('/api/categories')
            .then(r => r.json())
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error('Error fetching categories:', err)
                setCategories([])
            })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const productSlug = formData.slug || formData.name.toLowerCase().replace(/ /g, '-')

            // Call API instead of direct supabase to bypass RLS
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    slug: productSlug,
                    images,
                    variants
                })
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create product')
            }

            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-black min-h-screen pb-24">
            <div className="max-w-4xl mx-auto">
                <Link href="/admin/products" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to all products
                </Link>

                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Add New Product</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* General Info */}
                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-bold border-b border-neutral-800 pb-3">Basic Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Product Name</label>
                                <input
                                    required
                                    className="input-field py-2"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Slug (Optional)</label>
                                <input
                                    className="input-field py-2"
                                    placeholder="auto-generated"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Price (PKR)</label>
                                <input
                                    required
                                    type="number"
                                    className="input-field py-2"
                                    value={formData.base_price}
                                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Description</label>
                            <textarea
                                className="input-field py-2 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Gender</label>
                                <select
                                    className="input-field py-2"
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="">None</option>
                                    <option value="men">Men</option>
                                    <option value="women">Women</option>
                                    <option value="unisex">Unisex</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Category</label>
                                <select
                                    className="input-field py-2"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Total Stock</label>
                                <input
                                    type="number"
                                    className="input-field py-2"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                className="w-4 h-4 rounded border-neutral-800 bg-black accent-white"
                                checked={formData.is_featured}
                                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            />
                            <label htmlFor="featured" className="text-[10px] font-black text-white uppercase tracking-widest">Mark as featured</label>
                        </div>
                    </section>

                    {/* Images */}
                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
                        <h2 className="text-lg font-bold border-b border-neutral-800 pb-3">Product Images</h2>
                        <DragDropUpload images={images} onUpdate={setImages} />
                    </section>

                    {/* Variants */}
                    <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6">
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
                            <h2 className="text-lg font-bold">Variants</h2>
                            <button
                                type="button"
                                onClick={() => setVariants([...variants, { size: '', color: '', stock: 0 }])}
                                className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                            >
                                <Plus className="w-3 h-3" /> Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {variants.map((v, i) => (
                                <div key={i} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase text-neutral-500 mb-1 block">Size</label>
                                        <input
                                            placeholder="XL, 32, etc"
                                            className="input-field py-2"
                                            value={v.size}
                                            onChange={(e) => {
                                                const newV = [...variants]; newV[i].size = e.target.value; setVariants(newV);
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase text-neutral-500 mb-1 block">Color</label>
                                        <input
                                            placeholder="Black, Red"
                                            className="input-field py-2"
                                            value={v.color}
                                            onChange={(e) => {
                                                const newV = [...variants]; newV[i].color = e.target.value; setVariants(newV);
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                                        className="p-3 hover:bg-red-900/30 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                            {variants.length === 0 && <p className="text-neutral-500 text-sm">No variants added yet.</p>}
                        </div>
                    </section>

                    <div className="flex gap-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-primary py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                            Publish Product
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 text-neutral-400 hover:text-white font-bold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
