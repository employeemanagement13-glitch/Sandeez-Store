import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { auth, clerkClient } from '@clerk/nextjs/server'

async function checkIsAdmin() {
    try {
        const { userId } = await auth()
        console.log('[AdminAuth] userId:', userId)
        if (!userId) {
            console.warn('[AdminAuth] No userId found')
            return false
        }

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const email = (user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
            || user.emailAddresses[0]?.emailAddress)?.toLowerCase()

        console.log('[AdminAuth] User email from Clerk:', email)

        if (!email) return false

        const { data, error } = await supabaseAdmin
            .from('admins')
            .select('email')
            .eq('email', email)
            .eq('is_active', true)
            .single()

        if (error) {
            console.error('[AdminAuth] DB Lookup Error (User not in admins table?):', error.message)
            return false
        }

        console.log('[AdminAuth] Admin Authorized:', data.email)
        return !!data
    } catch (e) {
        console.error('[AdminAuth] Exception during check:', e)
        return false
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // 1. Authenticate
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) return NextResponse.json({ error: 'Unauthorized: User not in admins table' }, { status: 401 })

    // 2. Fetch Data
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log('PATCH /api/admin/orders/[id] hit')

    // 1. Authenticate
    const isAdmin = await checkIsAdmin()
    if (!isAdmin) {
        console.warn('Unauthorized update attempt')
        return NextResponse.json({ error: 'Unauthorized: User not in admins table' }, { status: 401 })
    }

    const { id } = await params
    try {
        const body = await request.json()
        console.log('Admin Update body:', body)
        const { fulfillment_status, payment_status } = body

        const updates: any = {}
        if (fulfillment_status) updates.fulfillment_status = fulfillment_status
        if (payment_status) updates.payment_status = payment_status

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error

        console.log('Admin Update success:', data)
        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Admin Update error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
