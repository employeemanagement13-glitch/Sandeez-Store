'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Edit, Trash2, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return

        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setProducts(products.filter(p => p.id !== id))
            } else {
                const data = await response.json()
                alert(data.error || 'Failed to delete product')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('An error occurred while deleting the product')
        }
    }

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-black min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Products</h1>
                    <p className="text-neutral-400 mt-2">Manage your inventory and product listings.</p>
                </div>
                <Link href="/admin/products/new" className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-bold">
                    <Plus className="w-5 h-5" />
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-8">
                <div className="relative">
                    <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name or slug..."
                        className="w-full pl-12 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-24">
                        <Loader2 className="animate-spin h-12 w-12 text-white mx-auto mb-4" />
                        <p className="text-neutral-500 uppercase tracking-widest text-xs">Loading products...</p>
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Product</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Category</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Price</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400">Stock</th>
                                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-neutral-950 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-bold text-white group-hover:text-neutral-300 transition-colors">{product.name}</p>
                                                <p className="text-xs text-neutral-500 font-mono mt-1">{product.slug}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-neutral-300 text-sm">{product.category?.name || 'Uncategorized'}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-bold text-white font-mono">{formatPrice(product.base_price)}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${product.stock_quantity === 0 ? 'bg-red-500' :
                                                    product.stock_quantity < 5 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`} />
                                                <span className={`text-sm font-medium ${product.stock_quantity === 0 ? 'text-red-400' :
                                                    product.stock_quantity < 5 ? 'text-yellow-400' : 'text-neutral-300'
                                                    }`}>
                                                    {product.stock_quantity}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2 hover:bg-neutral-800 rounded-lg transition-colors group/btn"
                                                    title="Edit Product"
                                                >
                                                    <Edit className="w-4 h-4 text-neutral-400 group-hover/btn:text-white" />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-red-900/30 rounded-lg transition-colors group/del"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Delete Product"
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
                        <p className="text-neutral-500">No products matching your search found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
