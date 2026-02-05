'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        city: '',
        country: 'Pakistan', // Default to Pakistan
        postal_code: '',
    })

    const [shippingCost, setShippingCost] = useState(0)

    useEffect(() => {
        // Simple client-side estimation for display purposes
        if (formData.country.toLowerCase().includes('pakistan')) {
            setShippingCost(0)
        } else {
            setShippingCost(10) // $10 approx 2800 PKR, but we use strict currency. Assuming base currency is same.
            // Wait, base_price is DECIMAL. If it's PKR, 10 is nothing.
            // unique requirement: "from US then 10$"
            // If the store is single currency, we need to know what 10$ is. 
            // Assuming the store uses a currency where 10 is significant or standard USD.
            // Let's stick to the requested logic: 10 if not Pakistan.
        }
    }, [formData.country])

    const subtotal = getTotal()
    const total = subtotal + shippingCost

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
                <Link href="/shop" className="btn-primary">
                    Start Shopping
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    shipping_address: `${formData.shipping_address}, ${formData.city}, ${formData.country}, ${formData.postal_code}`,
                    items,
                }),
            })

            const data = await response.json()

            if (data.success) {
                clearCart()
                router.push(`/order-confirmation?order=${data.order.order_number}`)
            } else {
                alert('Failed to place order. Please try again.')
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <Link href="/shop" className="inline-flex items-center text-neutral-500 hover:text-white mb-6 transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to shopping
                    </Link>
                    <h1 className="text-5xl font-bold tracking-tighter">Checkout</h1>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-12">
                            <section>
                                <h2 className="text-xl font-bold mb-8 tracking-tight">Contact Information</h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="md:col-span-2">
                                        <label className="text-[11px] font-bold text-neutral-500 mb-2 block tracking-tight">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field !bg-neutral-950 !border-neutral-800 !py-4 !text-sm"
                                            placeholder="Full Name"
                                            value={formData.customer_name}
                                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-bold text-neutral-500 mb-2 block tracking-tight">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="input-field !bg-neutral-950 !border-neutral-800 !py-4 !text-sm"
                                            placeholder="Email Address"
                                            value={formData.customer_email}
                                            onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            className="input-field"
                                            placeholder="+92 3XX XXXXXXX"
                                            value={formData.customer_phone}
                                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-8 tracking-tight">Shipping Address</h2>
                                <div className="space-y-8">
                                    <div>
                                        <label className="text-[11px] font-bold text-neutral-500 mb-2 block tracking-tight">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field !bg-neutral-950 !border-neutral-800 !py-4 !text-sm"
                                            placeholder="House number and street name"
                                            value={formData.shipping_address}
                                            onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-[11px] font-bold text-neutral-500 mb-2 block tracking-tight">
                                                Country
                                            </label>
                                            <select
                                                required
                                                className="input-field !bg-neutral-950 !border-neutral-800 !py-4 !text-sm"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            >
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="United States">United States</option>
                                                <option value="United Kingdom">United Kingdom</option>
                                                <option value="Canada">Canada</option>
                                                <option value="Australia">Australia</option>
                                                <option value="UAE">UAE</option>
                                                <option value="Saudi Arabia">Saudi Arabia</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-neutral-500 mb-2 block tracking-tight">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="input-field !bg-neutral-950 !border-neutral-800 !py-4 !text-sm"
                                                placeholder="City"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                className="input-field"
                                                value={formData.postal_code}
                                                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-xl font-bold mb-8 tracking-tight">Payment Method</h2>
                                <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-2xl">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full shrink-0">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight text-lg">Cash on Delivery (COD)</p>
                                            <p className="text-neutral-500 text-sm">Pay when your order arrives at your doorstep.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-4 rounded-full text-lg font-bold disabled:opacity-50 transition-all hover:scale-[1.01]"
                            >
                                {loading ? 'Processing Order...' : `Complete Purchase — ${formatPrice(total)}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary Sticky */}
                    <div className="lg:col-span-5">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start gap-4 text-sm">
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-neutral-500 text-xs">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}</p>
                                        </div>
                                        <p className="font-bold">{formatPrice(item.product.base_price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-neutral-800 pt-6">
                                <div className="flex justify-between text-neutral-400">
                                    <span>Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-400">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold pt-4 border-t border-neutral-800">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 text-sm text-neutral-400">
                                <div className="flex gap-3">
                                    <Clock className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                                    <span>Delivery expected within 3-5 business days.</span>
                                </div>
                                <div className="flex gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span>Free returns within 7 days of delivery.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
