import { supabase, supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react'
import { use } from 'react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const cleanSlug = slug.trim()
    console.log('[CategoryLoad] Slug:', slug)
    console.log('[CategoryLoad] Clean Slug:', cleanSlug)

    console.log(`[CategoryLoad] Slug: "${slug}" Clean: "${cleanSlug}"`)

    // 1. Try Exact Slug Match
    let { data: category, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .eq('slug', cleanSlug)
        .single()

    // 2. If not found, Try Case-Insensitive Slug Match
    if (!category && !error) {
        console.log('[CategoryLoad] Exact match failed, trying ILIKE')
        const { data: fuzzy } = await supabaseAdmin
            .from('categories')
            .select('*')
            .ilike('slug', cleanSlug)
            .single()
        if (fuzzy) category = fuzzy
        console.log('[CategoryLoad] ILIKE match:', fuzzy)
    }

    // 3. If still not found, check if it's a UUID and try ID match
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cleanSlug)
    if (!category && isUUID) {
        console.log('[CategoryLoad] Slug failed, trying ID match')
        const { data: byId } = await supabaseAdmin
            .from('categories')
            .select('*')
            .eq('slug', cleanSlug)
            .single()
        if (byId) category = byId
        console.log('[CategoryLoad] ID match:', byId)
    }

    if (!category) {
        console.error('[CategoryLoad] Final: Not Found')
        return (
            <div className="min-h-screen bg-black text-white p-20 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Category Not Found</h1>
                <p className="text-neutral-500 mb-8">Could not locate category for: <span className="text-white font-mono">{slug}</span></p>
                <Link href="/categories" className="px-6 py-2 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-colors">
                    Back to Categories
                </Link>
            </div>
        )
    }

    // Fetch Catalogues for this Category
    const { data: cataRes } = await supabaseAdmin
        .from('catalogue_categories')
        .select('catalogue:catalogues(*)')
        .eq('category_id', category.id)

    const catalogues = cataRes?.map((c: any) => c.catalogue) || []

    return (
        <div className="bg-black min-h-screen pb-20 pt-10">
            <div className="max-w-6xl mx-auto px-6">
                <Link href="/categories" className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors text-[10px] font-black uppercase tracking-widest gap-2">
                    <ArrowLeft className="w-3 h-3" /> Back to All Categories
                </Link>

                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tighter">{category.name}</h1>
                    <p className="text-neutral-400 text-sm max-w-xl font-medium tracking-wide">
                        {category.description || `Browse collections within ${category.name}.`}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catalogues.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/catalogues/${cat.id}`}
                            className="group bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition-all duration-500 block"
                        >
                            <div className="aspect-[16/9] bg-neutral-950 overflow-hidden">
                                {cat.image_url ? (
                                    <img
                                        src={cat.image_url}
                                        alt={cat.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Sparkles className="w-12 h-12 text-neutral-800 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                )}
                            </div>
                            <div className="p-10">
                                <h3 className="text-3xl font-black text-white mb-3 group-hover:text-neutral-200 transition-colors uppercase tracking-tighter leading-none">{cat.name}</h3>
                                <p className="text-neutral-500 text-xs max-w-sm font-medium tracking-wide mb-8">
                                    {cat.description || `Specialized curation of gear for ${cat.name}.`}
                                </p>
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                                    View Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {catalogues.length === 0 && (
                    <div className="text-center py-32 border border-dashed border-neutral-800 rounded-3xl">
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">No catalogues active in this category.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
