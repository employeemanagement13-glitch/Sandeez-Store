'use client'

import { useEffect, useState, Suspense } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/customer/ProductCard'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function ShopContent() {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        gender: searchParams.get('gender') || '',
        category: searchParams.get('category') || '',
        collection: searchParams.get('collection') || searchParams.get('catalogue') || '',
        sortBy: searchParams.get('sortBy') || 'newest',
        search: searchParams.get('search') || ''
    })

    // Sync filters when URL params change (e.g., from footer links)
    useEffect(() => {
        setFilters({
            gender: searchParams.get('gender') || '',
            category: searchParams.get('category') || '',
            collection: searchParams.get('collection') || searchParams.get('catalogue') || '',
            sortBy: searchParams.get('sortBy') || 'newest',
            search: searchParams.get('search') || ''
        })
    }, [searchParams])

    useEffect(() => {
        fetchProducts()
    }, [filters])

    const fetchProducts = async () => {
        setLoading(true)
        const params = new URLSearchParams()

        if (filters.gender) params.append('gender', filters.gender)
        if (filters.category) params.append('category', filters.category)
        if (filters.collection) params.append('collection', filters.collection)
        if (filters.sortBy) params.append('sortBy', filters.sortBy)
        if (filters.search) params.append('search', filters.search)

        try {
            const response = await fetch(`/api/products?${params.toString()}`)
            const data = await response.json()
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setLoading(false)
        }
    }

    const clearFilters = () => {
        setFilters({
            gender: '',
            category: '',
            collection: '',
            sortBy: 'newest',
            search: ''
        })
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-12">
                    <div className="max-w-2xl">
                        <h1 className="text-5xl font-bold mb-4 tracking-tight">Shop All</h1>
                        <p className="text-neutral-400 text-lg">
                            Explore our curated collection of premium quality outerwear.
                        </p>
                    </div>

                    {/* Active Filters count */}
                    {(filters.gender || filters.category || filters.collection || filters.search) && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-white underline hover:text-neutral-300 w-max"
                        >
                            Reset filters
                        </button>
                    )}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0 space-y-10">
                        {/* Search in Sidebar */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Search</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    className="input-field pl-10"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Gender selection */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Gender</h3>
                            <div className="space-y-2">
                                {['', 'men', 'women'].map((gender) => (
                                    <button
                                        key={gender}
                                        onClick={() => setFilters({ ...filters, gender })}
                                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${filters.gender === gender
                                            ? 'bg-neutral-900 text-white font-bold'
                                            : 'text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {gender === '' ? 'All Genders' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category/Collection Context */}
                        {(filters.category || filters.collection) && (
                            <div className="pt-4 border-t border-neutral-800">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Active Filter</h3>
                                <div className="flex items-center justify-between text-sm bg-neutral-900 p-2 rounded">
                                    <span className="text-neutral-300 truncate">
                                        {filters.category || filters.collection}
                                    </span>
                                    <button
                                        onClick={() => setFilters({ ...filters, category: '', collection: '' })}
                                        className="text-neutral-500 hover:text-white"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Sorting */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4">Sort by</h3>
                            <select
                                className="input-field text-sm"
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="featured">Featured Items</option>
                            </select>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="aspect-square bg-neutral-900 rounded-lg mb-4" />
                                        <div className="h-4 bg-neutral-900 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-neutral-900 rounded w-1/4" />
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-lg">
                                <X className="w-12 h-12 text-neutral-800 mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">No results found</h3>
                                <p className="text-neutral-500 mb-6 text-center max-w-sm">
                                    We couldn't find any products matching your current filters. Try resetting them.
                                </p>
                                <button onClick={clearFilters} className="btn-secondary py-2">
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    )
}
