import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, message } = body

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('inquiries')
            .insert({
                name,
                email,
                message,
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('Contact submission error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
