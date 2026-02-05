import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'Sandeez | Premium Outerwear Store',
    description: 'Shop premium quality jackets, puffers, leather jackets, and coats for men and women. Fast delivery across Pakistan with Cash on Delivery.',
    keywords: ['jackets', 'coats', 'puffers', 'leather jackets', 'winter wear', 'Pakistan'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider>
            <html lang="en" className={outfit.variable}>
                <body className={outfit.className}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
