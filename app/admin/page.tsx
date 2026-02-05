import { supabaseAdmin } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function getDashboardStats() {
    // Get total revenue
    const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('total')

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0

    // Get order counts
    const { data: allOrders } = await supabaseAdmin
        .from('orders')
        .select('*')

    const totalOrders = allOrders?.length || 0
    const pendingOrders = allOrders?.filter(o => o.fulfillment_status === 'unfulfilled').length || 0
    const completedOrders = allOrders?.filter(o => o.fulfillment_status === 'delivered').length || 0

    // Get product stats
    const { data: products } = await supabaseAdmin
        .from('products')
        .select('*')

    const totalProducts = products?.length || 0
    const lowStockProducts = products?.filter(p => p.stock_quantity < 5).length || 0

    return {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        totalProducts,
        lowStockProducts,
    }
}

async function getRecentOrders() {
    const { data } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    return data || []
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()
    const recentOrders = await getRecentOrders()

    return (
        <div>
            <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="card">
                    <p className="text-neutral-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">{formatPrice(stats.totalRevenue)}</p>
                </div>

                <div className="card">
                    <p className="text-neutral-400 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                        {stats.pendingOrders} pending • {stats.completedOrders} completed
                    </p>
                </div>

                <div className="card">
                    <p className="text-neutral-400 text-sm mb-1">Total Products</p>
                    <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                </div>

                <div className="card">
                    <p className="text-neutral-400 text-sm mb-1">Low Stock Alerts</p>
                    <p className="text-3xl font-bold text-white">{stats.lowStockProducts}</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white uppercase">Recent Orders</h2>
                    <Link href="/admin/orders" className="text-white font-semibold hover:text-neutral-300 underline underline-offset-4">
                        View All
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Order #</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Total</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-neutral-400">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-neutral-900 hover:bg-neutral-900/50">
                                        <td className="py-3 px-4 font-mono text-sm uppercase text-neutral-300">{order.order_number}</td>
                                        <td className="py-3 px-4 text-white">{order.customer_name}</td>
                                        <td className="py-3 px-4 font-semibold text-white">{formatPrice(order.total)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${order.fulfillment_status === 'delivered' ? 'bg-green-900/40 text-green-400' :
                                                order.fulfillment_status === 'shipped' ? 'bg-blue-900/40 text-blue-400' :
                                                    order.fulfillment_status === 'confirmed' ? 'bg-yellow-900/40 text-yellow-400' :
                                                        'bg-neutral-800 text-neutral-400'
                                                }`}>
                                                {order.fulfillment_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-neutral-500 text-sm">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-neutral-500 text-center py-8">No orders yet</p>
                )}
            </div>
        </div>
    )
}
