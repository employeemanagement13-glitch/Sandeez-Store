'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface Catalogue {
    id: string
    name: string
    slug: string
    description: string
    image_url: string | null
    is_active: boolean
}

const ITEMS_PER_PAGE = 9

export default function CataloguesPage() {
    const [catalogues, setCatalogues] = useState<Catalogue[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        fetch('/api/catalogues')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter only active catalogues
                    setCatalogues(data.filter((c: Catalogue) => c.is_active !== false))
                }
            })
            .catch(err => console.error('Error fetching catalogues:', err))
            .finally(() => setLoading(false))
    }, [])

    const totalPages = Math.ceil(catalogues.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedCatalogues = catalogues.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            <div className="max-w-6xl mx-auto px-6 pt-12">
                {/* Header */}
                <header className="mb-12 border-b border-neutral-800 pb-12">
                    <h1 className="text-5xl font-bold text-white tracking-tighter mb-4">Catalogues</h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        Browse our curated collections, each showcasing a unique selection of premium outerwear.
                    </p>
                </header>

                {/* Catalogues Grid - 3 columns */}
                {paginatedCatalogues.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {paginatedCatalogues.map((catalogue) => (
                            <Link
                                key={catalogue.id}
                                href={`/catalogues/${catalogue.id}`}
                                className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-500 block"
                            >
                                <div className="aspect-[4/3] bg-neutral-950 overflow-hidden">
                                    {catalogue.image_url ? (
                                        <img
                                            src={catalogue.image_url}
                                            alt={catalogue.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Sparkles className="w-12 h-12 text-neutral-800 group-hover:text-white transition-colors duration-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-neutral-200 transition-colors uppercase tracking-tighter">
                                        {catalogue.name}
                                    </h3>
                                    <p className="text-neutral-500 text-xs mb-4 font-medium tracking-wide line-clamp-2">
                                        {catalogue.description || `Explore our ${catalogue.name} collection.`}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                                        View Collection <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 border border-dashed border-neutral-800 rounded-3xl">
                        <Sparkles className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">No catalogues available.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => goToPage(page)}
                                className={`w-10 h-10 rounded-lg font-bold text-sm transition-colors ${currentPage === page
                                        ? 'bg-white text-black'
                                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {/* Next Button */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
