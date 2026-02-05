import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('catalogues')
        .select(`
            *,
            products:product_catalogues(
                product_id,
                product:products(*)
            )
        `)
        .eq('id', id)
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const body = await request.json()
        const { name, slug, description, image_url, is_active, product_ids } = body

        // 1. Update Catalogue info
        const { error: catError } = await supabaseAdmin
            .from('catalogues')
            .update({ name, slug, description, image_url, is_active })
            .eq('id', id)

        if (catError) throw catError

        // 2. Sync Products (Delete removed, Add new)
        if (product_ids !== undefined) {
            // Delete existing
            await supabaseAdmin.from('product_catalogues').delete().eq('catalogue_id', id)

            // Re-insert
            if (product_ids.length > 0) {
                const junctionData = product_ids.map((pid: string) => ({
                    catalogue_id: id,
                    product_id: pid
                }))
                await supabaseAdmin.from('product_catalogues').insert(junctionData)
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { error } = await supabaseAdmin
        .from('catalogues')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
