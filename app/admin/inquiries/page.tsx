'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Search, Loader2, Mail, Calendar } from 'lucide-react'

interface Inquiry {
    id: string
    name: string
    email: string
    message: string
    created_at: string
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        try {
            const response = await fetch('/api/admin/inquiries')
            const data = await response.json()
            setInquiries(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching inquiries:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredInquiries = inquiries.filter(inquiry =>
        inquiry.name.toLowerCase().includes(search.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(search.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="bg-black min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight uppercase">Inquiries</h1>
                    <p className="text-neutral-400 mt-2 font-medium">View customer inquiries from the contact form.</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
                <div className="relative">
                    <Search className="w-5 h-5 text-neutral-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search by name, email or message..."
                        className="input-field pl-12"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Inquiries List */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-24">
                        <Loader2 className="animate-spin h-12 w-12 text-white mx-auto mb-4" />
                        <p className="text-neutral-500 uppercase tracking-widest text-[10px] font-black">Loading inquiries...</p>
                    </div>
                ) : filteredInquiries.length > 0 ? (
                    <div className="divide-y divide-neutral-800">
                        {filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="p-6 hover:bg-neutral-950 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5 text-neutral-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{inquiry.name}</h3>
                                            <div className="flex items-center gap-2 text-neutral-500 text-xs">
                                                <Mail className="w-3 h-3" />
                                                <span>{inquiry.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-neutral-500 text-xs">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(inquiry.created_at).toLocaleDateString()} at {new Date(inquiry.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <div className="bg-black/50 border border-neutral-800 rounded-lg p-4">
                                    <p className="text-neutral-300 text-sm whitespace-pre-wrap">{inquiry.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <MessageSquare className="w-12 h-12 text-neutral-800 mx-auto mb-4" />
                        <p className="text-neutral-500 font-medium">No inquiries found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
