'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Eye, Trash2, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders')
            const data = await response.json()
            setOrders(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id)
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fulfillment_status: newStatus })
            })

            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, fulfillment_status: newStatus } : o))
            } else {
                alert('Failed to update status')
            }
        } catch (error) {
            console.error('Update error:', error)
        } finally {
            setUpdatingId(null)
        }
    }

    const handlePaymentStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingPaymentId(id)
        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_status: newStatus })
            })

            if (response.ok) {
                setOrders(orders.map(o => o.id === id ? { ...o, payment_status: newStatus } : o))
            } else {
                alert('Failed to update payment status')
            }
        } catch (error) {
            console.error('Update error:', error)
        } finally {
            setUpdatingPaymentId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return

        try {
            const response = await fetch(`/api/admin/orders/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setOrders(orders.filter(o => o.id !== id))
            }
        } catch (error) {
            console.error('Delete error:', error)
        }
    }

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(search.toLowerCase())
    )

    const statusColors: Record<string, string> = {
        unfulfilled: 'bg-neutral-800 text-neutral-400',
        confirmed: 'bg-yellow-900/40 text-yellow-400',
        shipped: 'bg-blue-900/40 text-blue-400',
        delivered: 'bg-green-900/40 text-green-400',
        cancelled: 'bg-red-900/40 text-red-400'
    }

    const paymentColors: Record<string, string> = {
        pending: 'bg-neutral-800 text-neutral-400',
        paid: 'bg-green-900/40 text-green-400',
        failed: 'bg-red-900/40 text-red-400',
        refunded: 'bg-orange-900/40 text-orange-400'
    }

    return (
        <div className="bg-black min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Orders</h1>
                    <p className="text-neutral-400 mt-2 font-medium">Manage customer purchases and fulfillment status.</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
                <div className="relative">
                    <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by order number, name or email..."
                        className="input-field pl-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-24">
                        <Loader2 className="animate-spin h-12 w-12 text-white mx-auto mb-4" />
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">Loading orders...</p>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-800 bg-neutral-900/50">
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Order</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Customer</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Items</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Totals</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Fulfilment</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Payment</th>
                                    <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-950 transition-colors group text-sm">
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-neutral-300 uppercase font-black tracking-tight text-xs">#{order.order_number}</span>
                                            <div className="text-[10px] text-neutral-500 mt-1">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="font-bold text-white">{order.customer_name}</p>
                                                <p className="text-[10px] text-neutral-500 font-medium">{order.customer_email}</p>
                                                <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">{order.shipping_address}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                {order.order_items?.map((item: any) => (
                                                    <div key={item.id} className="text-xs">
                                                        <span className="text-white font-medium">{item.quantity}x</span>{' '}
                                                        <span className="text-neutral-400">{item.product_name}</span>
                                                        {item.size && <span className="text-neutral-600 text-[10px] ml-1">({item.size})</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1 text-right">
                                                <div className="flex justify-between gap-4 text-xs">
                                                    <span className="text-neutral-500">Sub:</span>
                                                    <span className="text-neutral-400">{formatPrice(order.subtotal)}</span>
                                                </div>
                                                <div className="flex justify-between gap-4 text-xs">
                                                    <span className="text-neutral-500">Ship:</span>
                                                    <span className="text-neutral-400">{formatPrice(order.shipping_cost)}</span>
                                                </div>
                                                <div className="flex justify-between gap-4 text-sm font-bold border-t border-neutral-800 pt-1 mt-1">
                                                    <span className="text-neutral-500">Tot:</span>
                                                    <span className="text-white">{formatPrice(order.total)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="relative group/status flex items-center gap-2">
                                                <select
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={updatingId === order.id}
                                                    value={order.fulfillment_status}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className={`appearance-none px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none transition-all ${statusColors[order.fulfillment_status] || 'bg-neutral-800'}`}
                                                >
                                                    <option value="unfulfilled">Unfulfilled</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                {updatingId === order.id && <Loader2 className="w-3 h-3 animate-spin text-white" />}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="relative group/status flex items-center gap-2">
                                                <select
                                                    onClick={(e) => e.stopPropagation()}
                                                    disabled={updatingPaymentId === order.id}
                                                    value={order.payment_status}
                                                    onChange={(e) => handlePaymentStatusUpdate(order.id, e.target.value)}
                                                    className={`appearance-none px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none transition-all ${paymentColors[order.payment_status] || 'bg-neutral-800'}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="failed">Failed</option>
                                                    <option value="refunded">Refunded</option>
                                                </select>
                                                {updatingPaymentId === order.id && <Loader2 className="w-3 h-3 animate-spin text-white" />}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-2 hover:bg-neutral-800 rounded-xl transition-colors group/btn"
                                                >
                                                    <Eye className="w-4 h-4 text-neutral-400 group-hover/btn:text-white" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(order.id)}
                                                    className="p-2 hover:bg-red-900/30 rounded-xl transition-colors group/del"
                                                >
                                                    <Trash2 className="w-4 h-4 text-neutral-500 group-hover/del:text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <ShoppingBag className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500 font-medium">No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
