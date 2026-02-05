import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ isAdmin: false })
        }

        // Use supabaseAdmin (Service Role) to bypass RLS and check admin status
        const { data, error } = await supabaseAdmin
            .from('admins')
            .select('email, is_active')
            .eq('email', email.toLowerCase())
            .eq('is_active', true)
            .single()

        if (error || !data) {
            console.log(`Access denied for: ${email}`)
            return NextResponse.json({ isAdmin: false })
        }

        console.log(`Access granted for: ${email}`)
        return NextResponse.json({ isAdmin: true })
    } catch (error) {
        console.error('Admin check error:', error)
        return NextResponse.json({ isAdmin: false })
    }
}
