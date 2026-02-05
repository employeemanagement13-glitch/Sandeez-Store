import { NextResponse } from 'next/server'
import { supabaseAdmin, isAdminClient } from '@/lib/supabase'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
            *,
            items:order_items(*)
        `)
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json(data)
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAdminClient) return NextResponse.json({ error: 'Config error' }, { status: 500 })
    const { id } = await params

    const { error } = await supabaseAdmin.from('orders').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    console.log('PATCH /api/orders/[id] hit')
    if (!isAdminClient) {
        console.error('Config error: isAdminClient is false')
        return NextResponse.json({ error: 'Config error' }, { status: 500 })
    }
    const { id } = await params
    console.log('Updating order:', id)

    try {
        const body = await request.json()
        console.log('Update body:', body)
        const { fulfillment_status, payment_status } = body

        // Construct update object dynamically to allow partial updates
        const updates: any = {}
        if (fulfillment_status) updates.fulfillment_status = fulfillment_status
        if (payment_status) updates.payment_status = payment_status

        const { data, error } = await supabaseAdmin
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) {
            console.error('Supabase update error:', error)
            throw error
        }

        console.log('Update success:', data)
        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Catch error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
