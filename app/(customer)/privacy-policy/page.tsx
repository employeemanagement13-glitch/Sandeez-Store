export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-bold mb-12 tracking-tight">Privacy Policy</h1>
                    <p className="text-neutral-500 font-mono text-xs text-right">Last Updated: January 2026</p>
                </header>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-6 tracking-tight">Introduction</h2>
                        <p className="text-neutral-400 leading-relaxed text-lg">
                            At Sandeez, we believe fashion should be simple, elegant, and dependable.
                            This Privacy Policy describes how we collect, use, and disclose your personal information
                            when you visit or make a purchase from sandeez.com.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                            <h2 className="text-xl font-bold mb-4 text-white">Information We Collect</h2>
                            <ul className="space-y-3 text-neutral-400 text-sm">
                                <li className="flex gap-3"><span className="text-white">●</span> Contact details (Name, Shipping Address, Phone, Email)</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Financial details (Payment confirmation, Transaction details)</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Account information (Username, Preferences, Settings)</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Transaction history (Items purchased, returns, exchanges)</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Device & usage info (IP address, browser type, interaction logs)</li>
                            </ul>
                        </div>
                        <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                            <h2 className="text-xl font-bold mb-4 text-white">How We Use It</h2>
                            <ul className="space-y-3 text-neutral-400 text-sm">
                                <li className="flex gap-3"><span className="text-white">●</span> Processing and fulfilling your orders</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Managing your account and preferences</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Sending transactional and promotional communications</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Improving our services and user experience</li>
                                <li className="flex gap-3"><span className="text-white">●</span> Detecting and preventing fraudulent activity</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 tracking-tight">Your Rights & Choices</h2>
                        <p className="text-neutral-400 leading-relaxed text-lg mb-8">
                            Depending on where you live, you may have specific rights regarding your personal information:
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { title: 'Access', desc: 'Request a copy of the personal information we hold about you.' },
                                { title: 'Correction', desc: 'Request that we correct any inaccurate or incomplete data.' },
                                { title: 'Deletion', desc: 'Request that we delete your personal information in certain cases.' }
                            ].map((right) => (
                                <div key={right.title} className="p-6 border border-neutral-900 rounded-xl hover:border-neutral-700 transition-colors">
                                    <h3 className="font-bold text-white mb-2">{right.title}</h3>
                                    <p className="text-neutral-500 text-xs leading-relaxed">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="p-8 bg-neutral-900 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-4">Security & Retention</h2>
                            <p className="text-neutral-400 leading-relaxed">
                                We implement industry-standard security measures to protect your personal information.
                                We retain your information only for as long as necessary to fulfill the purposes for
                                which it was collected, including for the purposes of satisfying any legal or
                                reporting requirements.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    </section>
                </div>

                <div className="mt-24 p-12 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
                    <h2 className="text-2xl font-bold mb-4">Contact Our Privacy Team</h2>
                    <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
                        Should you have any questions about our privacy practices or this Privacy Policy,
                        please reach out to our dedicated support team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="mailto:contact@sandeez.com" className="text-white font-bold text-xl hover:text-neutral-300 transition-colors border-b-2 border-white pb-1">
                            contact@sandeez.com
                        </a>
                        <span className="hidden sm:block text-neutral-700">|</span>
                        <span className="text-neutral-400 font-mono text-sm uppercase tracking-widest">
                            Lahore, Pakistan
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
