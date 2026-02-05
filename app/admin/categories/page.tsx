'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Loader2, FolderOpen, Check, ImageIcon } from 'lucide-react'
import DragDropUpload from '@/components/admin/DragDropUpload'

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([])
    const [catalogues, setCatalogues] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        image_url: '',
        catalogue_ids: [] as string[]
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [catRes, cataRes] = await Promise.all([
                fetch('/api/categories'),
                fetch('/api/catalogues')
            ])
            const cats = await catRes.json()
            const catas = await cataRes.json()
            setCategories(Array.isArray(cats) ? cats : [])
            setCatalogues(Array.isArray(catas) ? catas : [])
        } catch (error) {
            console.error('Fetch error:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
        const method = editingId ? 'PATCH' : 'POST'

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                setIsModalOpen(false)
                setFormData({ name: '', slug: '', description: '', image_url: '', catalogue_ids: [] })
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
        if (!confirm('Delete this category?')) return
        try {
            const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
            if (response.ok) fetchData()
        } catch (error) {
            alert('Delete failed')
        }
    }

    const toggleCatalogue = (catalogueId: string) => {
        setFormData(prev => ({
            ...prev,
            catalogue_ids: prev.catalogue_ids.includes(catalogueId)
                ? prev.catalogue_ids.filter(id => id !== catalogueId)
                : [...prev.catalogue_ids, catalogueId]
        }))
    }

    return (
        <div className="bg-black min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Categories</h1>
                    <p className="text-neutral-400 mt-2">The highest level of store organization.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setFormData({ name: '', slug: '', description: '', image_url: '', catalogue_ids: [] })
                        setIsModalOpen(true)
                    }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-bold"
                >
                    <Plus className="w-5 h-5" />
                    New Category
                </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {loading && categories.length === 0 ? (
                    <div className="text-center py-24">
                        <Loader2 className="animate-spin h-12 w-12 text-white mx-auto" />
                    </div>
                ) : categories.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Category Name</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Contains</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {categories.map((cat) => (
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
                                            {cat.catalogues?.length || 0} catalogues
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(cat.id);
                                                        setFormData({
                                                            name: cat.name,
                                                            slug: cat.slug,
                                                            description: cat.description || '',
                                                            image_url: cat.image_url || '',
                                                            catalogue_ids: cat.catalogues?.map((c: any) => c.catalogue_id || c.catalogue?.id) || []
                                                        });
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors group/edit"
                                                >
                                                    <Edit className="w-4 h-4 text-neutral-400 group-hover/edit:text-white" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 hover:bg-red-900/30 rounded-lg transition-colors group/del"
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
                        <FolderOpen className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500">No categories created yet.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-2xl rounded-2xl p-8 shadow-2xl max-h-[90vh] flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
                            {editingId ? 'Edit Category' : 'Create Category'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Name</label>
                                    <input
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Slug</label>
                                    <input
                                        className="input-field"
                                        placeholder="auto-generated"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Category Image</label>
                                <DragDropUpload
                                    images={formData.image_url ? [formData.image_url] : []}
                                    onUpdate={(urls) => setFormData({ ...formData, image_url: urls[0] || '' })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Associate Catalogues</label>
                                <div className="grid grid-cols-2 gap-2 p-4 border border-neutral-800 rounded-xl bg-black/50 max-h-60 overflow-y-auto">
                                    {catalogues.map(catalogue => (
                                        <button
                                            key={catalogue.id}
                                            type="button"
                                            onClick={() => toggleCatalogue(catalogue.id)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${formData.catalogue_ids.includes(catalogue.id)
                                                ? 'bg-white text-black font-bold'
                                                : 'bg-neutral-900 text-neutral-400 hover:text-white'
                                                }`}
                                        >
                                            <span className="truncate pr-2">{catalogue.name}</span>
                                            {formData.catalogue_ids.includes(catalogue.id) && <Check className="w-3 h-3 flex-shrink-0" />}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-[10px] text-neutral-500 mt-2">{formData.catalogue_ids.length} catalogues selected</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2 block">Description</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-neutral-900 pb-2">
                                <button type="submit" disabled={loading} className="flex-1 btn-primary py-3 rounded-full font-bold flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                                    {editingId ? 'Save Changes' : 'Create Category'}
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
