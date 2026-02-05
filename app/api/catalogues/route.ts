import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    const { data, error } = await supabaseAdmin
        .from('catalogues')
        .select(`
            *,
            products:product_catalogues(
                product:products(*)
            )
        `)
        .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, description, image_url, is_active, product_ids } = body

        // 1. Create Catalogue
        const { data: catalogue, error: catError } = await supabaseAdmin
            .from('catalogues')
            .insert([{ name, slug, description, image_url, is_active }])
            .select()
            .single()

        if (catError) throw catError

        // 2. Add Products if any
        if (product_ids && product_ids.length > 0) {
            const junctionData = product_ids.map((pid: string) => ({
                catalogue_id: catalogue.id,
                product_id: pid
            }))
            const { error: jError } = await supabaseAdmin
                .from('product_catalogues')
                .insert(junctionData)

            if (jError) throw jError
        }

        return NextResponse.json(catalogue)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
