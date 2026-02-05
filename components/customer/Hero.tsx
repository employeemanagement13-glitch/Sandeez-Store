'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'

export default function Hero() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)

            // Fetch products sorted by sold_quantity (popularity)
            // Note: Requires 'sold_quantity' column in products table (added via migration)
            const { data: productsData } = await supabase
                .from('products')
                .select('*, images:product_images(*)')
                .order('sold_quantity', { ascending: false, nullsFirst: false })
                .order('created_at', { ascending: false }) // Fallback

            if (productsData) {
                // Determine layout logic (already sorted by popularity)
                const sorted = [...productsData].sort((a, b) => {
                    const soldA = a.sold_quantity || 0
                    const soldB = b.sold_quantity || 0

                    if (soldB !== soldA) return soldB - soldA
                    // Custom feature override could go here if requested, but user asked for order priority
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })

                setProducts(sorted)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="max-w-[1400px] mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
                    <div className="md:col-span-2 bg-neutral-900 rounded-2xl animate-pulse" />
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 bg-neutral-900 rounded-2xl animate-pulse" />
                        <div className="flex-1 bg-neutral-900 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        )
    }

    if (products.length === 0) return null

    const firstThree = products.slice(0, 3)
    const remaining = products.slice(3)

    return (
        <section className="bg-black py-4">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Grid */}
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-1000 ${firstThree.length === 1 ? 'md:grid-cols-1' :
                    firstThree.length === 2 ? 'md:grid-cols-2' : ''
                    }`}>
                    {/* Main Featured Product (Left) */}
                    {firstThree[0] && (
                        <div className={`${firstThree.length > 1 ? 'md:col-span-2' : ''} relative group overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3] md:aspect-auto md:h-[600px]`}>
                            <ProductHeroCard product={firstThree[0]} priority />
                        </div>
                    )}

                    {/* Side Products (Right) */}
                    {firstThree.length > 1 && (
                        <div className="flex flex-col gap-4">
                            {firstThree[1] && (
                                <div className="flex-1 relative group overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3] md:aspect-auto">
                                    <ProductHeroCard product={firstThree[1]} />
                                </div>
                            )}
                            {firstThree[2] && (
                                <div className="flex-1 relative group overflow-hidden rounded-2xl bg-neutral-900 aspect-[4/3] md:aspect-auto">
                                    <ProductHeroCard product={firstThree[2]} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Slider for remaining products */}
                {remaining.length > 0 && (
                    <div className="mt-8">
                        <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x">
                            {remaining.map((product) => (
                                <div
                                    key={product.id}
                                    className="relative flex-none w-[80vw] md:w-[31%] aspect-square group overflow-hidden rounded-2xl bg-neutral-900 snap-start border border-neutral-800"
                                >
                                    <ProductHeroCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}

function ProductHeroCard({ product, priority = false }: { product: Product; priority?: boolean }) {
    const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url ||
        product.images?.[0]?.image_url ||
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200'

    return (
        <Link href={`/product/${product.slug}`} className="block h-full w-full relative">
            <Image
                src={primaryImage}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 33vw"
            />
            {/* Overlay for better label readability hover */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />

            {/* Label pill - Exact Acme Style */}
            <div className="absolute bottom-6 left-6 flex items-stretch bg-black/70 backdrop-blur-xl rounded-full border border-white/20 overflow-hidden transition-all duration-500 group-hover:scale-105 max-w-[90%]">
                <span className="pl-4 pr-3 py-2 text-[10px] md:text-sm font-bold text-white uppercase tracking-tighter truncate flex items-center">
                    {product.name}
                </span>
                <span className="px-3 py-2 bg-white text-[10px] md:text-sm font-black text-black whitespace-nowrap flex items-center">
                    {formatPrice(product.base_price)} USD
                </span>
            </div>
        </Link>
    )
}
