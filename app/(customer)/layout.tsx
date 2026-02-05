import Navbar from '@/components/customer/Navbar'
import Footer from '@/components/customer/Footer'
import CartSidebar from '@/components/customer/CartSidebar'

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-black">
                {children}
            </main>
            <Footer />
            <CartSidebar />
        </>
    )
}
