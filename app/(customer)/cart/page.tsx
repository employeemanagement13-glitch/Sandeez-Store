'use client'

import { useCart } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, calculateShipping } from '@/lib/utils'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart()

    const subtotal = getTotal()
    const shipping = calculateShipping(subtotal)
    const total = subtotal + shipping

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-8">Add some products to get started!</p>
                    <Link href="/shop" className="btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => {
                            const primaryImage = item.product.images?.find(img => img.is_primary)?.image_url ||
                                item.product.images?.[0]?.image_url ||
                                'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'

                            return (
                                <div key={`${item.product.id}-${item.size}-${item.color}-${index}`} className="card flex gap-6">
                                    {/* Product Image */}
                                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        <Image
                                            src={primaryImage}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-900">
                                                    {item.product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {item.size && `Size: ${item.size}`}
                                                    {item.size && item.color && ' • '}
                                                    {item.color && `Color: ${item.color}`}
                                                </p>
                                                <p className="text-lg font-bold text-primary-700 mt-2">
                                                    {formatPrice(item.product.base_price)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.product.id, item.size, item.color)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1), item.size, item.color)}
                                                className="w-8 h-8 border-2 border-gray-300 rounded hover:border-gray-400 flex items-center justify-center"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)}
                                                className="w-8 h-8 border-2 border-gray-300 rounded hover:border-gray-400 flex items-center justify-center"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="font-semibold">
                                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                    </span>
                                </div>

                                {shipping === 0 && subtotal >= 5000 && (
                                    <p className="text-sm text-green-600 font-medium">
                                        🎉 You got free shipping!
                                    </p>
                                )}

                                {subtotal < 5000 && (
                                    <p className="text-sm text-gray-500">
                                        Add {formatPrice(5000 - subtotal)} more for free shipping
                                    </p>
                                )}

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-xl font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="btn-primary w-full block text-center mb-3">
                                Proceed to Checkout
                            </Link>

                            <Link href="/shop" className="btn-secondary w-full block text-center">
                                Continue Shopping
                            </Link>

                            <button
                                onClick={clearCart}
                                className="w-full text-red-600 hover:text-red-700 text-sm font-medium mt-4"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
