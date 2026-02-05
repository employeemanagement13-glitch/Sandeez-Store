import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import ProductCard from '@/components/customer/ProductCard'

export default async function CatalogueDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [catRes, prodRes] = await Promise.all([
        supabase.from('catalogues').select('*').eq('id', id).single(),
        supabase.from('product_catalogues').select('product:products(*, images:product_images(*))').eq('catalogue_id', id)
    ])

    const catalogue = catRes.data
    const products = prodRes.data?.map(p => p.product) || []

    if (!catalogue) {
        return <div className="min-h-screen bg-black text-white p-20 text-center uppercase tracking-widest font-black">Collection Not Found</div>
    }

    return (
        <div className="bg-black min-h-screen pb-20 pt-10">
            <div className="max-w-6xl mx-auto px-6">
                <Link href="/categories" className="inline-flex items-center text-neutral-500 hover:text-white mb-8 transition-colors text-[10px] font-black uppercase tracking-widest gap-2">
                    <ArrowLeft className="w-3 h-3" /> All Categories
                </Link>

                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-800 pb-12">
                    <div className="max-w-2xl text-left">
                        <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter leading-none">{catalogue.name}</h1>
                        <p className="text-neutral-400 text-sm font-medium tracking-wide">
                            {catalogue.description || `Discover our premium ${catalogue.name} selection.`}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block mb-1">Curation</span>
                        <span className="text-3xl font-mono font-black text-white">{products.length} Items</span>
                    </div>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-40 border border-dashed border-neutral-800 rounded-3xl">
                        <ShoppingBag className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">This collection is currently empty.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
