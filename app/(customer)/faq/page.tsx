export default function FAQPage() {
    const faqs = [
        {
            q: "How can I pay for my order?",
            a: "We primary accept Cash on Delivery (COD) to ensure maximum trust and security. You pay only when the product is in your hands."
        },
        {
            q: "What are the shipping charges?",
            a: "We offer Free Shipping on all orders from Pakistan. For orders outside Pakistan, a flat standard delivery fee of $10 applies."
        },
        {
            q: "How long does it take for my order to arrive?",
            a: "Main hubs (Lahore, Karachi, Islamabad) typically receive orders within 2-4 working days. Delivery to other cities may take 4-7 working days. In case of orders outside Pakistan, it may take 7-14 working days."
        },
        {
            q: "Can I cancel or modify my order?",
            a: "No. According to our policy, orders once confirmed cannot be canceled or modified. Please double-check your details before finalizing the checkout."
        },
        {
            q: "What is your return policy?",
            a: "We do not offer returns or refunds for change of mind or size preference. However, if you receive a damaged or defective product, please contact us within 7 days for a replacement."
        }
    ]

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-16">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">FAQ</h1>
                    <p className="text-neutral-500 text-xl font-medium">
                        Everything you need to know about our store and products.
                    </p>
                </header>

                <div className="prose prose-invert max-w-none divide-y divide-neutral-900 border-t border-neutral-900">
                    {faqs.map((faq, i) => (
                        <div key={i} className="py-10 group">
                            <h3 className="text-2xl font-bold mb-4 text-white tracking-tight flex justify-between items-center group-hover:text-neutral-300 transition-colors">
                                {faq.q}
                            </h3>
                            <p className="text-neutral-400 leading-relaxed text-lg">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-24 p-12 bg-neutral-900 rounded-2xl border border-neutral-800 text-center">
                    <h2 className="text-2xl font-bold mb-3 tracking-tight">Still have questions?</h2>
                    <p className="text-neutral-500 mb-10 text-lg font-medium">If you cannot find the answer you're looking for, please contact our team.</p>
                    <a href="/contact" className="btn-primary !px-12 !py-4 !rounded-full !text-sm !font-black !tracking-tight">Contact Us</a>
                </div>
            </div>
        </div>
    )
}
