'use client'

import { LayoutDashboard, Package, FolderKanban, ShoppingCart, ListTree, ConciergeBell } from 'lucide-react'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

export default function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/admin/products', icon: Package, label: 'Products' },
        { href: '/admin/categories', icon: ListTree, label: 'Categories' },
        { href: '/admin/catalogues', icon: FolderKanban, label: 'Catalogues' },
        { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { href: '/admin/inquiries', icon: ConciergeBell, label: 'Inquiries' },
    ]

    return (
        <div className="w-64 bg-black border-r border-neutral-800 text-white min-h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Logo */}
            <div className="p-8 border-b border-neutral-800">
                <Link href="/admin" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-black rotate-45" />
                    </div>
                    ADMIN
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                ? 'bg-white text-black font-bold'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-neutral-500 group-hover:text-white transition-colors'}`} />
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-6 border-t border-neutral-800">
                <div className="flex items-center gap-4 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
                    <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }} />
                    <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate">Administrator</span>
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Store Manager</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
