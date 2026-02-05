'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/customer/ProductCard'
import { Snowflake } from 'lucide-react'

export default function WinterCollectionPage() {
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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Snowflake className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">Winter Collection 2026</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Stay warm and stylish with our premium winter outerwear. From cozy puffers to elegant wool coats.
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
                            Explore our {products.length} winter essentials
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600">Winter collection coming soon!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
