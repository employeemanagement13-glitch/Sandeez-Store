import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import Hero from '@/components/customer/Hero'
import ProductCard from '@/components/customer/ProductCard'
import Newsletter from '@/components/customer/Newsletter'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

async function getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*, images:product_images(*)')
        .eq('is_featured', true)
        .limit(4)
        .order('created_at', { ascending: false })
    return data || []
}

async function getCategories() {
    const { data } = await supabase.from('categories').select('*').limit(3)
    // Filter out categories without slugs just in case
    return data?.filter(c => c.slug) || []
}

export default async function HomePage() {
    const [featuredProducts, categories] = await Promise.all([
        getFeaturedProducts(),
        getCategories(),
    ])

    return (
        <div className="bg-black">
            <Hero />

            {/* Featured Products Section */}
            <section className="py-12 md:py-20">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 md:mb-12">
                        <div>
                            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500 mb-1 md:mb-2">Curated Selection</h2>
                            <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tighter">Featured Products</h3>
                        </div>
                        <Link href="/shop" className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white pb-1 hover:text-neutral-400 hover:border-neutral-400 transition-all w-fit">
                            View All
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Grid */}
            <section className="py-20 bg-neutral-950 border-y border-neutral-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.slug}`}
                                className="group block"
                            >
                                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 mb-6">
                                    {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt={cat.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                                            <span className="text-neutral-700 text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">{cat.name}</h3>
                                    <p className="text-neutral-500 text-xs mb-4 font-medium tracking-wide line-clamp-2">{cat.description}</p>
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                        Explore Collection <ArrowRight className="w-3 h-3" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Newsletter />
        </div>
    )
}
