'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export default function SearchBar() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Product[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const searchProducts = async () => {
            if (query.trim().length < 2) {
                setResults([])
                setIsOpen(false)
                return
            }

            setIsLoading(true)
            try {
                // Global search for all products
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        images:product_images(*)
                    `)
                    .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
                    .limit(6)

                if (error) throw error
                setResults(data || [])
                setIsOpen(true)
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        const debounce = setTimeout(searchProducts, 300)
        return () => clearTimeout(debounce)
    }, [query])

    return (
        <div ref={searchRef} className="relative w-full max-w-sm">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 group-focus-within:text-white transition-colors" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search premium gear..."
                    className="search-input !rounded-full !pl-10 !pr-10 !py-3 !text-[14px] !font-medium !tracking-tight"
                />
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                        <X className="w-3 h-3 text-neutral-500 hover:text-white" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-tight text-neutral-500 px-2">Top Results</span>
                        {isLoading && <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />}
                    </div>

                    {results.length > 0 ? (
                        <div className="divide-y divide-neutral-800/50">
                            {results.map((product) => {
                                const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url ||
                                    product.images?.[0]?.image_url ||
                                    '/placeholder-product.jpg'

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={() => { setQuery(''); setIsOpen(false); }}
                                        className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-800 transition-all group/item"
                                    >
                                        <div className="relative w-10 h-10 flex-shrink-0 rounded-lg bg-neutral-800 overflow-hidden border border-neutral-700/50">
                                            <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-[13px] font-bold text-white truncate tracking-tight group-hover/item:text-neutral-200">
                                                {product.name}
                                            </h4>
                                            <p className="text-[10px] text-neutral-500 font-mono font-bold">
                                                {formatPrice(product.base_price)}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-neutral-700 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0 -translate-x-2 transition-all" />
                                    </Link>
                                )
                            })}
                            <Link
                                href="/shop"
                                className="block w-full py-3 text-center text-[12px] font-bold tracking-tight text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                View all products
                            </Link>
                        </div>
                    ) : !isLoading && (
                        <div className="p-8 text-center text-neutral-500 text-[12px] font-bold tracking-tight">
                            No matches found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
