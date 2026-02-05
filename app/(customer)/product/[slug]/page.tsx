'use client'

import { use, useEffect, useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/store'
import { ShoppingCart, Truck, Shield, ArrowLeft, Check } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const router = useRouter()
    const searchParams = useSearchParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

    // Sync state with URL params for Vercel-style behavior
    const selectedSize = searchParams.get('size') || ''
    const selectedColor = searchParams.get('color') || ''

    const { addItem, openCart } = useCart()

    useEffect(() => {
        fetchProduct()
    }, [slug])

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products?slug=${slug}`)
            const products = await response.json()
            if (products && products.length > 0) {
                setProduct(products[0])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, value)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleAddToCart = () => {
        if (!product) return

        addItem({
            product,
            quantity: 1,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
        })

        openCart()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <h1 className="text-xl font-bold text-white mb-4">Product not found</h1>
                <Link href="/shop" className="btn-primary">
                    Back to Shop
                </Link>
            </div>
        )
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : [{ image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', is_primary: true }]

    const availableSizes = [...new Set(product.variants?.map(v => v.size))].filter(Boolean) as string[]
    const availableColors = [...new Set(product.variants?.map(v => v.color))].filter(Boolean) as string[]

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
                {/* Back Link */}
                <Link href="/shop" className="inline-flex items-center text-neutral-500 hover:text-white mb-6 transition-colors text-xs font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Back
                </Link>

                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left: Images */}
                    <div className="lg:col-span-7 space-y-3">
                        <div className="aspect-square relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
                            <Image
                                src={images[selectedImage]?.image_url || images[0].image_url}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-5 gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square relative rounded-lg overflow-hidden border transition-all ${selectedImage === idx ? 'border-white' : 'border-neutral-800 opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <Image src={img.image_url} alt="" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info */}
                    <div className="lg:col-span-5 flex flex-col pt-2">
                        <div className="mb-6 flex flex-col">
                            <h1 className="text-3xl font-bold mb-2 tracking-tighter">{product.name}</h1>
                            <div className="w-max bg-white text-black text-xs font-black px-2 py-1 rounded mt-1">
                                {formatPrice(product.base_price)}
                            </div>
                        </div>

                        <div className="space-y-8 mb-10">
                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3 block">Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => updateParam('color', color)}
                                                className={`min-w-[3rem] h-9 px-4 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${selectedColor === color
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-white border-neutral-800 hover:border-neutral-400'
                                                    }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3 block">Size</label>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => updateParam('size', size)}
                                                className={`min-w-[3rem] h-9 px-4 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${selectedSize === size
                                                    ? 'bg-white text-black border-white'
                                                    : 'bg-transparent text-white border-neutral-800 hover:border-neutral-400'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-sm text-neutral-400 leading-relaxed font-medium">
                                {product.description || 'Premium quality garment designed for lasting style and supreme comfort.'}
                            </div>
                        </div>

                        {/* Action */}
                        <div className="mt-auto space-y-4 pt-6 border-t border-neutral-800">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock_quantity === 0 || (availableSizes.length > 0 && !selectedSize)}
                                className="w-full btn-primary h-12 flex items-center justify-center gap-2 disabled:bg-neutral-900 disabled:text-neutral-500 disabled:cursor-not-allowed group transition-all"
                            >
                                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {product.stock_quantity === 0 ? 'Out of Stock' : availableSizes.length > 0 && !selectedSize ? 'Select Size' : 'Add to Cart'}
                            </button>

                            <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-1">
                                <div className="flex items-center gap-2">
                                    <Truck className="w-3 h-3" />
                                    <span>Fast Shipping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-3 h-3" />
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
