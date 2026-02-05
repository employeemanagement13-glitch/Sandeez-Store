'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, MessageSquare, BookOpen, Send } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function Footer() {
    const currentYear = new Date().getFullYear()
    const [categories, setCategories] = useState<{ id: string, name: string, slug: string, image_url: string }[]>([])

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data)
                }
            })
            .catch(err => console.error('Error fetching categories for footer:', err))
    }, [])

    return (
        <footer className="bg-black border-t border-neutral-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-black mb-4 tracking-tighter">Sandeez</h3>
                        <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                            Premium outerwear designed for the modern lifestyle. Bridging the gap between traditional craftsmanship and contemporary aesthetics in Pakistan.
                        </p>
                        {/* Social Links */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="https://reddit.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800" title="Reddit">
                                <Image src="/reddit.png" height={16} width={16} alt="Reddit" className='invert' />
                            </a>
                            <a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800" title="Medium">
                                <Image src="/medium.png" height={16} width={16} alt="Medium" className='invert' />
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 rounded-full text-neutral-500 hover:text-white transition-colors border border-neutral-800" title="X (Twitter)">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Collection - Dynamic Categories */}
                    <div>
                        <h4 className="text-sm font-black mb-6 tracking-tight">Collections</h4>
                        <ul className="space-y-2">
                            <li><Link href="/shop" className="text-sm text-neutral-400 hover:text-white transition-colors">Shop All</Link></li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/shop?category=${cat.slug || cat.id}`} className="text-sm text-neutral-500 hover:text-white transition-colors font-medium">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help */}
                    <div>
                        <h4 className="text-sm font-black mb-6 tracking-tight">Customer Care</h4>
                        <ul className="space-y-2">
                            <li><Link href="/customer-service" className="text-sm text-neutral-400 hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="/shipping-info" className="text-sm text-neutral-400 hover:text-white transition-colors">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="text-sm text-neutral-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/faq" className="text-sm text-neutral-400 hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-black mb-6 tracking-tight">Company</h4>
                        <ul className="space-y-2">
                            <li><Link href="/our-story" className="text-sm text-neutral-400 hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link href="/privacy-policy" className="text-sm text-neutral-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="text-sm text-neutral-400 hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-900 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-neutral-600 font-medium">
                        © {currentYear} Sandeez. All rights reserved.
                    </p>
                    <p className="text-xs text-neutral-600 font-medium">
                        Made in Pakistan.
                    </p>
                </div>
            </div>
        </footer>
    )
}
