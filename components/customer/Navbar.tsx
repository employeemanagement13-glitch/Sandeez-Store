'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store'
import { useShallow } from 'zustand/react/shallow'
import SearchBar from './SearchBar'
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/nextjs'

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [categories, setCategories] = useState<{ id: string, name: string, slug: string }[]>([])
    const [mounted, setMounted] = useState(false)

    const { itemCount, openCart } = useCart(
        useShallow((state) => ({
            itemCount: state.getItemCount(),
            openCart: state.openCart,
        }))
    )

    useEffect(() => {
        setMounted(true)
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data)
            })
            .catch(err => console.error('Error fetching nav data:', err))
    }, [])

    return (
        <nav className="bg-black border-b border-neutral-900 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Logo and Desktop Nav */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-black text-white hover:text-neutral-300 transition-colors tracking-tighter">
                            Sandeez
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link href="/shop" className="nav-link">Shop All</Link>
                            <Link href="/catalogues" className="nav-link">Catalogues</Link>

                            {/* Category links */}
                            {categories.slice(0, 3).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/categories/${cat.slug}`}
                                    className="nav-link"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Search & Cart & Auth */}
                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="hidden lg:block w-80">
                            <SearchBar />
                        </div>

                        {/* Auth Section */}
                        <div className="flex items-center gap-4">
                            {mounted && (
                                <>
                                    <SignedIn>
                                        <UserButton
                                            afterSignOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    userButtonAvatarBox: "w-7 h-7"
                                                }
                                            }}
                                        />
                                    </SignedIn>
                                    <SignedOut>
                                        <Link href="/sign-in" className="text-neutral-400 hover:text-white transition-colors">
                                            <User className="w-5 h-5" />
                                        </Link>
                                    </SignedOut>
                                </>
                            )}
                        </div>

                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 hover:bg-neutral-900 rounded-full transition-colors group"
                        >
                            <ShoppingCart className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                            {mounted && itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-neutral-900 rounded-full transition-colors"
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5 text-white" />
                            ) : (
                                <Menu className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-neutral-950 border-t border-neutral-900 animate-in slide-in-from-top-4 duration-300">
                    <div className="px-4 py-8 space-y-6">
                        {/* Mobile Search */}
                        <SearchBar />

                        {/* Mobile Links */}
                        <div className="flex flex-col gap-6">
                            <Link href="/shop" className="text-xl font-black text-white" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                            <Link href="/catalogues" className="text-xl font-black text-white" onClick={() => setIsMenuOpen(false)}>Catalogues</Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/categories/${cat.slug}`}
                                    className="text-lg font-bold text-neutral-400 hover:text-white"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
