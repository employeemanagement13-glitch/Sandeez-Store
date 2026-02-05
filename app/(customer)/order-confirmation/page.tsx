'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'
import { formatPrice } from '@/lib/utils'

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('order')

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-20">
            <div className="max-w-2xl w-full text-center">
                <div className="mb-12">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                        <CheckCircle className="w-12 h-12 text-black" />
                    </div>

                    <h1 className="text-5xl font-bold mb-4 tracking-tight">
                        Order Confirmed
                    </h1>

                    {orderNumber && (
                        <p className="text-xl text-neutral-400 mb-6 font-mono">
                            # {orderNumber}
                        </p>
                    )}

                    <p className="text-neutral-400 text-lg max-w-md mx-auto">
                        Thank you for your purchase. Your order is being processed and will be with you shortly.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                        <Package className="w-6 h-6 text-white mb-4" />
                        <h3 className="font-bold mb-2">Next Steps</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            You'll receive a confirmation email. Our team is now preparing your items for shipment.
                        </p>
                    </div>
                    <div className="p-6 bg-neutral-900 rounded-xl border border-neutral-800">
                        <CheckCircle className="w-6 h-6 text-white mb-4" />
                        <h3 className="font-bold mb-2">Cash on Delivery</h3>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            Please have the exact amount ready. Your delivery will arrive in 3-5 business days.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/" className="btn-primary w-full sm:w-auto px-10">
                        Back to Home
                    </Link>

                    <Link href="/shop" className="text-neutral-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <p className="text-xs text-neutral-600 mt-16 uppercase tracking-widest">
                    Need help? Contact support@acmestore.com
                </p>
            </div>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        }>
            <OrderConfirmationContent />
        </Suspense>
    )
}
