export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Returns & Exchanges</h1>
                    <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                        At Sandeez, we ensure every order is carefully checked before dispatch to meet our premium quality standards.
                    </p>
                </header>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="bg-neutral-900 border border-neutral-800 p-12 rounded-2xl relative overflow-hidden">
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <h2 className="text-3xl font-black mb-6 tracking-tight text-white">Our Policy</h2>
                            <p className="text-neutral-300 leading-relaxed text-lg mb-8">
                                Please note that we <span className="text-white font-bold underline underline-offset-4 decoration-neutral-700">do not offer returns or refunds</span> for change of mind, size preference, or general change in selection except orders from Pakistan.
                            </p>
                            <div className="p-4 bg-black/50 border border-neutral-800 rounded-lg inline-block">
                                <p className="text-xs text-neutral-500 font-mono uppercase tracking-[0.2em]">Verified Dispatches Only</p>
                            </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-700 to-transparent opacity-30" />
                    </section>

                    <section className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">Damaged or Defective Items</h2>
                            <p className="text-neutral-400 leading-relaxed text-sm mb-6">
                                In the rare event that you receive a damaged or defective product, we are here to help.
                                You must contact us within <span className="text-white font-bold">7 days</span> of receiving your order.
                            </p>
                            <p className="text-neutral-400 leading-relaxed text-sm">
                                Our team will verify the reported issue, and once approved, we will arrange a replacement
                                or a return as per the assessment.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold mb-8 tracking-tight">Reporting an Issue</h2>
                            <div className="space-y-4">
                                {[
                                    { label: 'Step 1', text: 'Email or message us with your Order Number.' },
                                    { label: 'Step 2', text: 'Provide clear photos of the damaged part/product.' },
                                    { label: 'Step 3', text: 'Include detailed information about the issue.' }
                                ].map((step) => (
                                    <div key={step.label} className="flex items-center gap-6 p-4 bg-neutral-900/30 rounded-xl border border-neutral-900">
                                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">{step.label}</span>
                                        <span className="text-sm text-neutral-300 font-medium">{step.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="mt-20 p-12 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
                        <h2 className="text-2xl font-bold mb-4 tracking-tight">Questions?</h2>
                        <p className="text-neutral-500 mb-8 max-w-lg mx-auto italic">
                            "Thanks for understanding our commitment to sustainable and fair business practices."
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <a href="mailto:contact@sandeez.com" className="text-white font-black text-lg hover:text-neutral-300 transition-colors border-b-2 border-white pb-1 tracking-tight">
                                contact@sandeez.com
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
