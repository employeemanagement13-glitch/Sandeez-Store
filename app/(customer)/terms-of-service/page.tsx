export default function TermsConditionsPage() {
    const terms = [
        {
            title: "Order Processing",
            content: "All orders are processed once payment is confirmed. Please ensure that your contact and delivery details are accurate at checkout to avoid delays."
        },
        {
            title: "Product Information",
            content: "We aim to display products as accurately as possible. However, colors may slightly vary due to lighting or screen differences."
        },
        {
            title: "Return & Refund Policy",
            content: "We do not offer returns or refunds for reasons such as change of mind, size, or preference. In case of a damaged or defective product, you may contact us within 7 days of receiving your order."
        },
        {
            title: "Shipping",
            content: "Delivery timelines may vary depending on location and courier service. Sandeez is not responsible for any delays once the parcel has been handed over to the courier."
        },
        {
            title: "Order Cancellations",
            content: "Orders once confirmed cannot be canceled or modified."
        },
        {
            title: "Pricing & Availability",
            content: "Prices and availability of items are subject to change without prior notice."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16 text-left">
                    <h1 className="text-5xl font-bold mb-12 tracking-tight">Terms of Service</h1>
                    <p className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Effective and Last Updated: January 2026</p>
                </header>

                <div className="prose prose-invert max-w-none space-y-16">
                    <section>
                        <p className="text-xl text-neutral-400 leading-relaxed font-bold">
                            Welcome to Sandeez. By placing an order with us, you agree to the following terms and conditions
                            which govern our relationship with you in relation to this website and your purchases.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {terms.map((term, index) => (
                            <section key={term.title} className="bg-neutral-900/40 p-10 rounded-2xl border border-neutral-800 relative overflow-hidden group hover:border-neutral-700 transition-colors">
                                <span className="absolute -right-4 -top-4 text-neutral-800/10 text-9xl font-bold select-none">{index + 1}</span>
                                <h2 className="text-2xl font-bold mb-4 tracking-tight text-white">{term.title}</h2>
                                <p className="text-neutral-400 leading-relaxed text-sm">
                                    {term.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    <section className="bg-neutral-900/50 p-10 rounded-2xl border border-neutral-800">
                        <h2 className="text-2xl font-bold mb-6 tracking-tight">Intellectual Property</h2>
                        <p className="text-neutral-400 leading-relaxed text-lg mb-0">
                            All content, including designs, images, logos, and text on our page, are the property of Sandeez
                            and may not be reproduced, copied, or used for any purpose without explicit written permission.
                        </p>
                    </section>
                </div>

                <div className="mt-24 p-12 bg-neutral-950 rounded-2xl border border-neutral-800 text-center">
                    <h2 className="text-2xl font-bold mb-4">Questions?</h2>
                    <p className="text-neutral-500 mb-8 max-w-lg mx-auto">
                        If you have any questions about these Terms, please contact our support team.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <a href="mailto:contact@sandeez.com" className="text-white font-bold text-xl hover:text-neutral-300 transition-colors border-b-2 border-white pb-1">
                            contact@sandeez.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
