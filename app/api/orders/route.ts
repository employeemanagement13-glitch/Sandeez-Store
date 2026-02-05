import { NextResponse } from 'next/server'
import { supabaseAdmin, isAdminClient } from '@/lib/supabase'
import { generateOrderNumber } from '@/lib/utils'
import { clerkClient, auth } from '@clerk/nextjs/server'
import { verifyEmail } from '@/lib/email-verification'

// Helper to check if current user is an admin
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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const emailFilter = searchParams.get('email')?.toLowerCase()

    const isAdmin = await checkIsAdmin()

    let query = supabaseAdmin.from('orders').select('*, order_items(*)')

    if (!isAdmin) {
        // If not admin, you MUST provide an email, and we should ideally verify it matches the user
        // For now, at least enforce filtering so products aren't leaked
        if (!emailFilter) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        query = query.eq('customer_email', emailFilter)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            customer_email,
            customer_name,
            customer_phone,
            shipping_address,
            items,
        } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
        }

        // Robust email validation & verification
        const emailCheck = await verifyEmail(customer_email)
        if (!emailCheck.isValid) {
            return NextResponse.json({ error: emailCheck.error || 'Invalid email address' }, { status: 400 })
        }

        const subtotal = items.reduce(
            (sum: number, item: any) => sum + item.product.base_price * item.quantity,
            0
        )

        // Shipping cost is handled by DB trigger (calculate_shipping_cost)
        // We set 0 here as placeholder, trigger updates it
        const shipping_cost = 0
        const total = subtotal + shipping_cost

        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                order_number: generateOrderNumber(),
                customer_email: customer_email.toLowerCase(),
                customer_name,
                customer_phone,
                shipping_address,
                subtotal,
                shipping_cost, // DB Trigger will update this based on address
                total,         // DB Trigger will update this too
                payment_method: 'cod',
                payment_status: 'pending',
                fulfillment_status: 'unfulfilled',
            })
            .select()
            .single()

        if (orderError) throw orderError

        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.base_price,
            total_price: item.product.base_price * item.quantity,
            size: item.size || null,
            color: item.color || null,
        }))

        const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems)
        if (itemsError) throw itemsError

        return NextResponse.json({ success: true, order })
    } catch (error: any) {
        console.error('Order creation error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
