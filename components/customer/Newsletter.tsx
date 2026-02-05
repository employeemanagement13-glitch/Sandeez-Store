'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import emailjs from '@emailjs/browser'

export default function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setStatus('loading')

        try {
            // 1. Store in Supabase
            const { error: dbError } = await supabase
                .from('subscribers')
                .insert([{ email }])

            if (dbError) {
                if (dbError.code === '23505') {
                    // Already subscribed
                    setStatus('success')
                    setMessage('You are already subscribed!')
                    return
                }
                throw dbError
            }

            // 2. Send email via EmailJS
            const templateParams = {
                name: 'Dehleez Pakistan',
                time: new Date().toLocaleString(),
                message: 'Congractulations! You have been subscribed to our newsletter. You will now receive updates on new arrivals and exclusive offers. For more information, our customer support is always available at dehleezpakistan1@gmail.com or WhatsApp at +92 316 1234567, all handles on linktree https://linktr.ee/dehleezpakistan.  We will be back soon with more exciting products. Stay tuned!',
                to_email: email // Assuming we want to notify someone or send a confirmation
            }

            // The user provided the credentials in .env.local
            // NEXT_PUBLIC_SERVICE_ID=service_f8lraqh
            // NEXT_PUBLIC_TEMPLATE_ID=template_q78xhb6
            // NEXT_PUBLIC_PUBLIC_KEY=gYLpPM7sNFwCaxX52

            await emailjs.send(
                process.env.NEXT_PUBLIC_SERVICE_ID!,
                process.env.NEXT_PUBLIC_TEMPLATE_ID!,
                templateParams,
                process.env.NEXT_PUBLIC_PUBLIC_KEY!
            )

            setStatus('success')
            setMessage('Thank you for subscribing!')
            setEmail('')
        } catch (error) {
            console.error('Subscription error:', error)
            setStatus('error')
            setMessage('Something went wrong. Please try again.')
        }
    }

    return (
        <section className="py-20 border-t border-neutral-800 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Subscribe to our newsletter
                        </h2>
                        <p className="text-neutral-400">
                            Get the latest updates on new arrivals and exclusive offers.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full max-w-md">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                className="input-field flex-1"
                                disabled={status === 'loading'}
                            />
                            <button
                                type="submit"
                                className="btn-primary whitespace-nowrap"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </div>
                        {message && (
                            <p className={`mt-3 text-sm ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}
