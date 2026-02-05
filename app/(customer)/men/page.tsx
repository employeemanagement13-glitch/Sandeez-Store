'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import ProductCard from '@/components/customer/ProductCard'

export default function MenPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        const response = await fetch('/api/products?gender=men')
        const data = await response.json()
        setProducts(data)
        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Men's Collection</h1>
                    <p className="text-xl text-primary-100">Rugged, refined, and ready for anything</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto"></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <div className="mb-6 text-gray-600">
                            {products.length} product{products.length !== 1 ? 's' : ''} available
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-600">No men's products available yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
