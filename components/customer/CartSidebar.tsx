'use client'

import { useCart } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, calculateShipping } from '@/lib/utils'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'

export default function CartSidebar() {
    const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotal } = useCart()

    const subtotal = getTotal()
    const shipping = calculateShipping(subtotal)
    const total = subtotal + shipping

    // Close cart on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isCartOpen) {
                closeCart()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isCartOpen, closeCart])

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    if (!isCartOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className="backdrop"
                onClick={closeCart}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-black border-l border-neutral-800 z-50 shadow-2xl flex flex-col animate-slide-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-2xl font-black tracking-tight text-white">Cart</h2>
                    <button
                        onClick={closeCart}
                        className="p-1 hover:bg-neutral-900 rounded-full transition-colors border border-neutral-800"
                    >
                        <X className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="w-16 h-16 text-neutral-700 mb-4" />
                            <p className="text-neutral-400 mb-2">Your cart is empty</p>
                            <button
                                onClick={closeCart}
                                className="text-white underline hover:text-neutral-300"
                            >
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => {
                                const primaryImage = item.product.images?.find(img => img.is_primary)?.image_url ||
                                    item.product.images?.[0]?.image_url ||
                                    '/placeholder-product.jpg'

                                return (
                                    <div
                                        key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                                        className="flex gap-4 pb-4 border-b border-neutral-800"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-neutral-900">
                                            <Image
                                                src={primaryImage}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-white text-sm truncate">
                                                {item.product.name}
                                            </h3>
                                            {(item.size || item.color) && (
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    {item.size && `Size: ${item.size}`}
                                                    {item.size && item.color && ' • '}
                                                    {item.color && `${item.color}`}
                                                </p>
                                            )}
                                            <p className="text-sm font-medium text-white mt-1">
                                                {formatPrice(item.product.base_price)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 mt-4">
                                                <div className="flex items-center gap-3 bg-neutral-900 border border-neutral-800 rounded-full px-2 py-1">
                                                    <button
                                                        onClick={() => updateQuantity(
                                                            item.product.id,
                                                            Math.max(1, item.quantity - 1),
                                                            item.size,
                                                            item.color
                                                        )}
                                                        className="p-1 hover:text-white text-neutral-500 transition-colors"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-[12px] font-bold text-white min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(
                                                            item.product.id,
                                                            item.quantity + 1,
                                                            item.size,
                                                            item.color
                                                        )}
                                                        className="p-1 hover:text-white text-neutral-500 transition-colors"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                                                    className="p-2 hover:bg-neutral-900 rounded-full border border-neutral-800 transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-neutral-500 hover:text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer - Order Summary */}
                {items.length > 0 && (
                    <div className="border-t border-neutral-800 p-6 bg-neutral-950">
                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Subtotal</span>
                                <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Shipping</span>
                                <span className="text-white font-medium">
                                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                                </span>
                            </div>
                            {shipping === 0 && subtotal >= 5000 && (
                                <p className="text-xs text-green-500">
                                    🎉 You got free shipping!
                                </p>
                            )}
                            {subtotal < 5000 && (
                                <p className="text-xs text-neutral-500">
                                    Add {formatPrice(5000 - subtotal)} more for free shipping
                                </p>
                            )}
                            <div className="flex justify-between text-base font-bold pt-3 border-t border-neutral-800">
                                <span className="text-white">Total</span>
                                <span className="text-white">{formatPrice(total)}</span>
                            </div>
                        </div>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="btn-primary w-full block text-center mb-3 !py-4 !text-sm !font-black tracking-tight"
                        >
                            Proceed to Checkout
                        </Link>

                        <button
                            onClick={closeCart}
                            className="w-full text-center text-xs font-bold text-neutral-500 hover:text-white transition-colors tracking-tight"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </>
    )
}
