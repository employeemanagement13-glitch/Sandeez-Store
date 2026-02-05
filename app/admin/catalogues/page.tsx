'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, Sparkles, Check, X, ImageIcon } from 'lucide-react'
import DragDropUpload from '@/components/admin/DragDropUpload'

export default function AdminCataloguesPage() {
    const [catalogues, setCatalogues] = useState<any[]>([])
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        is_active: true,
        product_ids: [] as string[]
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                fetch('/api/catalogues'),
                fetch('/api/products')
            ])
            const cats = await catRes.json()
            const prods = await prodRes.json()
            setCatalogues(Array.isArray(cats) ? cats : [])
            setProducts(Array.isArray(prods) ? prods : [])
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const url = editingId ? `/api/catalogues/${editingId}` : '/api/catalogues'
        const method = editingId ? 'PATCH' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setIsModalOpen(false)
                setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true, product_ids: [] })
                setEditingId(null)
                fetchData()
            } else {
                const data = await response.json()
                alert(data.error || 'Operation failed')
            }
        } catch (error) {
            alert('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this catalogue?')) return
        try {
            const response = await fetch(`/api/catalogues/${id}`, { method: 'DELETE' })
            if (response.ok) fetchData()
        } catch (error) {
            alert('Delete failed')
        }
    }

    const toggleProduct = (productId: string) => {
        setFormData(prev => ({
            ...prev,
            product_ids: prev.product_ids.includes(productId)
                ? prev.product_ids.filter(id => id !== productId)
                : [...prev.product_ids, productId]
        }))
    }

    return (
        <div className="bg-black min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Catalogues</h1>
                    <p className="text-neutral-400 mt-2">Group products into marketing collections.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setFormData({ name: '', slug: '', description: '', image_url: '', is_active: true, product_ids: [] })
                        setIsModalOpen(true)
                    }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-bold"
                >
                    <Plus className="w-5 h-5" />
                    New Catalogue
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {loading && catalogues.length === 0 ? (
                    <div className="text-center py-24">
                        <Loader2 className="animate-spin h-12 w-12 text-white mx-auto" />
                    </div>
                ) : catalogues.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Name</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Products</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {catalogues.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-neutral-950 transition-colors group text-sm">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                {cat.image_url ? (
                                                    <img src={cat.image_url} alt={cat.name} className="w-10 h-10 rounded object-cover border border-neutral-800" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-neutral-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-white text-base">{cat.name}</p>
                                                    <p className="text-xs text-neutral-500 font-mono mt-0.5">{cat.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-neutral-400">
                                            {cat.products?.length || 0} items
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${cat.is_active ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                {cat.is_active ? 'Active' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(cat.id)
                                                        setFormData({
                                                            name: cat.name,
                                                            slug: cat.slug,
                                                            description: cat.description || '',
                                                            image_url: cat.image_url || '',
                                                            is_active: cat.is_active,
                                                            product_ids: cat.products?.map((p: any) => p.product_id || p.product?.id) || []
                                                        })
                                                        setIsModalOpen(true)
                                                    }}
                                                    className="p-2 hover:bg-neutral-800 rounded-lg group/edit"
                                                >
                                                    <Edit className="w-4 h-4 text-neutral-500 group-hover/edit:text-white" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 hover:bg-red-900/30 rounded-lg group/del"
                                                >
                                                    <Trash2 className="w-4 h-4 text-neutral-500 group-hover/del:text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <Sparkles className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500">No catalogues curated yet.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl p-8 shadow-2xl max-h-[90vh] flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
                            {editingId ? 'Edit Catalogue' : 'Create Catalogue'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block tracking-widest">Name</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block tracking-widest">Slug</label>
                                    <input
                                        className="input-field"
                                        placeholder="auto-generated"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block tracking-widest">Catalogue Image</label>
                                <DragDropUpload
                                    images={formData.image_url ? [formData.image_url] : []}
                                    onUpdate={(urls) => setFormData({ ...formData, image_url: urls[0] || '' })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block tracking-widest">Select Products</label>
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-neutral-800 p-4 rounded-xl bg-black/50">
                                    {products.map(product => (
                                        <button
                                            key={product.id}
                                            type="button"
                                            onClick={() => toggleProduct(product.id)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${formData.product_ids.includes(product.id)
                                                ? 'bg-white text-black font-bold'
                                                : 'bg-neutral-900 text-neutral-400 hover:text-white'
                                                }`}
                                        >
                                            <span className="truncate pr-2">{product.name}</span>
                                            {formData.product_ids.includes(product.id) && <Check className="w-3 h-3 flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-neutral-500 mt-2">{formData.product_ids.length} products selected</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase text-neutral-500 mb-2 block tracking-widest">Description</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    className="w-4 h-4 rounded accent-white"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <label htmlFor="is_active" className="text-xs font-bold text-white uppercase tracking-widest">Published & Visible</label>
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-neutral-900 pb-2">
                                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-full font-bold flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {editingId ? 'Save Changes' : 'Create Catalogue'}
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-neutral-400 hover:text-white font-bold transition-colors text-xs uppercase tracking-widest">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function Save({ className }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
}
