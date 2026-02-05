import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth, clerkClient } from '@clerk/nextjs/server'

async function checkIsAdmin() {
    try {
        const { userId } = await auth()
        if (!userId) return false

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const email = (user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
            || user.emailAddresses[0]?.emailAddress)?.toLowerCase()

        if (!email) return false

        const { data } = await supabaseAdmin
            .from('admins')
            .select('email')
            .eq('email', email)
            .eq('is_active', true)
            .single()

        return !!data
    } catch (e) {
        return false
    }
}

export async function GET() {
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
