import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FolderOpen, ArrowRight } from 'lucide-react'

export default async function CategoriesPage() {
    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    if (error) {
        return <div className="min-h-screen bg-black text-white p-20 text-center">Error loading categories</div>
    }

    return (
        <div className="bg-black min-h-screen pb-20 pt-10">
            <div className="max-w-6xl mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 tracking-tighter">Categories</h1>
                    <p className="text-neutral-400 text-sm max-w-xl font-medium  tracking-widest">
                        Browse our curated selection of high-performance gear, organized by category.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories?.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug || cat.id}`}
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
                                        <FolderOpen className="w-12 h-12 text-neutral-800 group-hover:text-white transition-colors duration-500" />
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <h3 className="text-2xl font-black text-white mb-2 group-hover:text-neutral-200 transition-colors uppercase tracking-tight">{cat.name}</h3>
                                <p className="text-neutral-500 text-xs line-clamp-2 mb-6 font-medium tracking-wide">
                                    {cat.description || `Explore our premium ${cat.name} collection.`}
                                </p>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white">
                                    Browse Category <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {categories?.length === 0 && (
                    <div className="text-center py-40 border border-dashed border-neutral-800 rounded-3xl">
                        <p className="text-neutral-500 uppercase tracking-widest text-xs font-black">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
