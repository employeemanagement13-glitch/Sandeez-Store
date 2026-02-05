'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Package, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    // const router = useRouter()
    console.log(id)
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrder()
    }, [id])

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setOrder(data)
        } catch (err) {
            console.error(err)
            setOrder(null)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (field: 'payment_status' | 'fulfillment_status', value: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value })
            })
            if (res.ok) fetchOrder()
            else alert('Update failed')
        } catch (err) {
            console.error(err)
            alert('Update failed')
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Loader2 className="animate-spin text-white w-10 h-10" />
        </div>
    )

    if (!order) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black">
            <h1 className="text-white text-2xl mb-4">Order not found</h1>
            <Link href="/admin/orders" className="btn-primary px-6 py-2 rounded-full">Back to Orders</Link>
        </div>
    )

    return (
        <div className="bg-black min-h-screen pb-20 p-8">
            <div className="max-w-6xl mx-auto">
                <Link href="/admin/orders" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors text-sm uppercase tracking-widest font-bold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Orders
                </Link>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-neutral-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Order #{order.order_number}</h1>
                        <p className="text-neutral-500 font-mono text-xs">{order.id}</p>
                        <p className="text-neutral-400 text-sm mt-4 font-medium flex items-center gap-2">
                            Placed on <span className="text-white">{new Date(order.created_at).toLocaleDateString()}</span> at {new Date(order.created_at).toLocaleTimeString()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 text-right">
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-bold">Fulfillment Status</span>
                            <select
                                value={order.fulfillment_status}
                                onChange={(e) => handleUpdate('fulfillment_status', e.target.value)}
                                className="bg-neutral-900 text-white text-sm border border-neutral-800 rounded px-3 py-2 font-bold uppercase tracking-wide cursor-pointer hover:border-neutral-600 transition-colors focus:ring-1 focus:ring-white outline-none"
                            >
                                <option value="unfulfilled">Unfulfilled</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500 block mb-2 font-bold">Payment Status</span>
                            <select
                                value={order.payment_status}
                                onChange={(e) => handleUpdate('payment_status', e.target.value)}
                                className="bg-neutral-900 text-white text-sm border border-neutral-800 rounded px-3 py-2 font-bold uppercase tracking-wide cursor-pointer hover:border-neutral-600 transition-colors focus:ring-1 focus:ring-white outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Items & Payment */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Items */}
                        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                            <div className="p-6 border-b border-neutral-800">
                                <h2 className="text-lg font-black text-white uppercase tracking-tight">Order Items</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-black/20">
                                        <tr>
                                            <th className="p-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Product</th>
                                            <th className="p-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold text-center">Qty</th>
                                            <th className="p-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold text-right">Price</th>
                                            <th className="p-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {order.items?.map((item: any) => (
                                            <tr key={item.id} className="text-sm">
                                                <td className="p-4">
                                                    <div className="font-bold text-white mb-1">{item.product_name}</div>
                                                    {(item.size || item.color) && (
                                                        <div className="text-xs text-neutral-500 font-medium">
                                                            {item.size && <span className="mr-2">Size: {item.size}</span>}
                                                            {item.color && <span>Color: {item.color}</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center text-neutral-400 font-mono">{item.quantity}</td>
                                                <td className="p-4 text-right text-neutral-400 font-mono">{formatPrice(item.unit_price)}</td>
                                                <td className="p-4 text-right text-white font-mono font-bold">{formatPrice(item.total_price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Payment & Totals */}
                        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-6">Payment Details</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Subtotal</span>
                                    <span className="text-white font-mono">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-medium">Shipping</span>
                                    <span className="text-white font-mono">{formatPrice(order.shipping_cost || 0)}</span>
                                </div>
                                <div className="border-t border-neutral-800 my-2 pt-4 flex justify-between items-center">
                                    <span className="text-base font-bold text-white uppercase tracking-wider">Total</span>
                                    <span className="text-2xl font-black text-white font-mono">{formatPrice(order.total)}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-between items-center">
                                    <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Payment Method</span>
                                    <span className="text-white font-medium uppercase text-sm bg-black px-3 py-1 rounded border border-neutral-800">{order.payment_method}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Customer & Shipping */}
                    <div className="space-y-8">
                        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-6">Customer</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-neutral-800 shrink-0">
                                        <Package className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Name</p>
                                        <p className="text-white font-bold">{order.customer_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-neutral-800 shrink-0">
                                        <Mail className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Email</p>
                                        <p className="text-white font-bold truncate">{order.customer_email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-neutral-800 shrink-0">
                                        <Phone className="w-5 h-5 text-neutral-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Phone</p>
                                        <p className="text-white font-bold">{order.customer_phone}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-6">Shipping Address</h2>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center border border-neutral-800 shrink-0 mt-1">
                                    <MapPin className="w-5 h-5 text-neutral-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">Address</p>
                                    <p className="text-white font-bold leading-relaxed">{order.shipping_address}</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
