export default function CustomerServicePage() {
    const helpLinks = [
        { title: 'Shipping & Delivery', href: '/shipping-info', desc: 'Track your order and learn about delivery timelines.' },
        { title: 'Returns & Exchanges', href: '/returns', desc: 'Read our policy on damaged items and replacements.' },
        { title: 'Frequently Asked Questions', href: '/faq', desc: 'Find quick answers to common queries.' },
        { title: 'Privacy Policy', href: '/privacy-policy', desc: 'Learn how we protect and manage your data.' },
    ]

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-20">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Help Center</h1>
                    <p className="text-neutral-400 text-xl font-medium leading-relaxed max-w-2xl">
                        Everything you need to know to shop with confidence at Sandeez.
                        Our team is dedicated to providing you with the best experience.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-6 mb-24">
                    {helpLinks.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            className="p-8 bg-neutral-900/40 rounded-3xl border border-neutral-900 hover:border-neutral-700 transition-all group"
                        >
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-neutral-300 transition-colors">{link.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{link.desc}</p>
                        </a>
                    ))}
                </div>

                <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-12">
                    <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-bold mb-4 tracking-tight">Direct Support</h2>
                            <p className="text-neutral-500 leading-relaxed mb-0">
                                Can't find what you're looking for? Reach out to our dedicated support team via email or social media.
                                We typically respond within 24 hours.
                            </p>
                        </div>
                        <div className="flex flex-col justify-center items-center md:items-end gap-6">
                            <a href="mailto:contact@sandeez.com" className="btn-primary !py-4 !px-8 !rounded-xl !text-xs !bg-white !text-black !font-black !uppercase !tracking-widest">
                                Contact Team
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
