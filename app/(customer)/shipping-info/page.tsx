export default function ShippingInfoPage() {
    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Shipping & Delivery</h1>
                    <p className="text-xl text-neutral-400 font-medium leading-relaxed">
                        We deliver meticulously crafted pieces across Pakistan, ensuring your order reaches you in pristine condition.
                    </p>
                </header>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="grid md:grid-cols-2 gap-8">
                        <div className="bg-neutral-900/50 p-8 rounded-2xl border border-neutral-800">
                            <h2 className="text-xl font-bold mb-4 text-white">Delivery Timelines</h2>
                            <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                                Our dedicated logistics partners work around the clock to ensure timely deliveries:
                            </p>
                            <ul className="space-y-3 text-neutral-400 text-sm">
                                <li className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span>Main Cities</span>
                                    <span className="text-white font-bold">2-4 Working Days</span>
                                </li>
                                <li className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span>Remote Areas</span>
                                    <span className="text-white font-bold">4-7 Working Days</span>
                                </li>
                            </ul>
                            <p className="mt-6 text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
                                *Timelines may vary during sales or festive seasons.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl flex flex-col justify-center text-black">
                            <h2 className="text-2xl font-black mb-2 tracking-tighter">Free Shipping</h2>
                            <p className="text-neutral-600 font-bold mb-6">On all orders from Pakistan</p>
                            <div className="h-px bg-neutral-200 mb-6" />
                            <p className="text-xs leading-relaxed font-medium">
                                For orders from foreign countries, a flat standard delivery fee of <strong>$10</strong> will be applied.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-6 tracking-tight">Order Tracking</h2>
                        <p className="text-neutral-400 leading-relaxed text-lg mb-8">
                            Once your order is dispatched, you will receive a details of your order via SMS and Email.
                            You can use them to monitor your package's progress.
                        </p>
                        <div className="p-8 border border-neutral-900 rounded-2xl bg-neutral-950">
                            <h3 className="text-white font-bold mb-2">Notice:</h3>
                            <p className="text-neutral-500 text-sm">
                                Sandeez is not responsible for any delays caused by courier services or unforeseen circumstances
                                once the parcel has been handed over for delivery.
                            </p>
                        </div>
                    </section>

                    <section className="p-12 bg-neutral-900 rounded-2xl border border-neutral-800 text-center">
                        <h2 className="text-2xl font-bold mb-4 tracking-tight">Cash on Delivery (COD)</h2>
                        <p className="text-neutral-400 leading-relaxed max-w-2xl mx-auto">
                            To ensure maximum trust and security, we primarily offer Cash on Delivery.
                            Please have the exact amount ready for the courier to ensure a smooth delivery process.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
