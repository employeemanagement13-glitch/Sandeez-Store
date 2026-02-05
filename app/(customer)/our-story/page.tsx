export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-24">
                <header className="text-center">
                    <h1 className="text-sm font-bold tracking-[0.4em] text-neutral-600 mb-8 uppercase">The Philosophy</h1>
                    <h2 className="text-7xl font-bold mb-12 tracking-tighter leading-[0.9]">
                        Simple. Elegant. Dependable.
                    </h2>
                    <p className="text-neutral-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        This is the essence behind every collection we create at Sandeez.
                    </p>
                </header>

                <div className="aspect-[21/9] bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden relative shadow-2xl shadow-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-[12vw] select-none tracking-tighter leading-none opacity-50">SANDEEZ</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-16 items-start">
                    <div className="space-y-8">
                        <p className="text-4xl font-bold text-white leading-[1.1] tracking-tighter">
                            Bridging the gap between heritage and modern utility.
                        </p>
                        <p className="text-neutral-500 leading-relaxed text-lg font-medium">
                            Sandeez (Ø¯ÛÙ„ÛŒØ²) represents a threshold. It is the point where traditional Pakistani craftsmanship
                            meets the clean lines of contemporary design. Born in Lahore, we sought to redefine what it means
                            to be "Made in Pakistan".
                        </p>
                    </div>
                    <div className="space-y-12">
                        <div className="p-10 border border-neutral-900 rounded-3xl bg-neutral-900/20 backdrop-blur-sm">
                            <h3 className="text-white font-bold mb-4 text-xs tracking-widest">The Vision</h3>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                                We moved away from the transient nature of fast fashion. Our goal was to build a brand
                                that values durability, character, and the stories woven into every garment.
                                A Sandeez piece is meant to stay in your wardrobe for seasons to come.
                            </p>
                        </div>
                        <div className="px-10">
                            <h3 className="text-white font-bold mb-4 text-xs tracking-widest">Our Roots</h3>
                            <p className="text-neutral-500 leading-relaxed font-medium text-sm">
                                Inspired by the intricate details of local artisans and the vibrant energy of our streets,
                                every jacket and coat is designed to withstand the diverse Pakistani climate while maintaining
                                a premium, minimalist silhouette.
                            </p>
                        </div>
                    </div>
                </div>

                <footer className="pt-20 border-t border-neutral-900 text-center">
                    <p className="text-neutral-700 text-[10px] font-bold tracking-[0.5em]">
                        Established 2024 • Sandeez Pakistan
                    </p>
                </footer>
            </div>
        </div>
    )
}
