'use client'

import { useState } from 'react'

export default function ContactUsPage() {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                alert('Message sent successfully!')
                setFormData({ name: '', email: '', message: '' })
            } else {
                alert(data.error || 'Failed to send message')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-20 text-center">
                    <h1 className="text-6xl mb-6 tracking-tighter font-bold">Stay in Touch</h1>
                    <p className="text-neutral-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Whether you have a question about an order, a product, or just want to share some feedback,
                        our team in Lahore is ready to assist.
                    </p>
                </header>

                <div className="grid lg:grid-cols-3 gap-16 items-start">
                    {/* Contact Info Sidebar */}
                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-6">Direct Channels</h3>
                            <div className="space-y-6">
                                <div className="group">
                                    <p className="text-[10px] font-bold text-white uppercase mb-1">Email Support</p>
                                    <a href="mailto:contact@sandeez.com" className="text-lg font-bold text-gray-100 group-hover:text-neutral-400 transition-colors">
                                        contact@sandeez.com
                                    </a>
                                </div>
                                <div className="group">
                                    <p className="text-[10px] font-bold text-white uppercase mb-1">WhatsApp / Call</p>
                                    <p className="text-lg font-bold text-gray-100">
                                        +92 (0) 321 0000000
                                    </p>
                                    <p className="text-[10px] text-neutral-600 font-mono mt-1">Available Mon-Sat, 10AM - 7PM PKT</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-6">Studio Location</h3>
                            <p className="text-gray-100 text-sm leading-relaxed font-bold">
                                Lahore City, Lahore<br />
                                Punjab 05472, Pakistan
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-neutral-900/40 p-10 rounded-3xl border border-neutral-900">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-sm focus:border-white transition-colors outline-none font-medium"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-sm focus:border-white transition-colors outline-none font-medium"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-1">
                                    Message
                                </label>
                                <textarea
                                    required
                                    className="w-full bg-black border border-neutral-800 rounded-xl px-5 py-4 text-sm focus:border-white transition-colors outline-none font-medium min-h-[180px] resize-none"
                                    placeholder="How can we help you today?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-colors shadow-2xl shadow-white/5 disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
