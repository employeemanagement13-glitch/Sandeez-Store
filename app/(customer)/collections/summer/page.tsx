'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/customer/ProductCard'
import { Sun } from 'lucide-react'

export default function SummerCollectionPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        // For now, showing all products. In production, you'd filter by a "season" field
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Sun className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Summer Collection 2026</h1>
                    <p className="text-xl text-yellow-100 max-w-2xl mx-auto">
                        Light, breathable, and perfect for warmer days. Discover our summer essentials.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="mb-6 text-gray-600 text-center">
                            Explore our {products.length} summer styles
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600">Summer collection coming soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
