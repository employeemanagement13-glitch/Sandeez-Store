import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('categories')
        .select(`
            *,
            catalogues:catalogue_categories(
                catalogue_id,
                catalogue:catalogues(*)
            )
        `)
        .eq('id', id)
        .single()

    if (error) {
        if (error.message.includes('catalogue_categories')) {
            const { data: simpleData, error: simpleError } = await supabaseAdmin
                .from('categories')
                .select('*')
                .eq('id', id)
                .single()
            if (simpleError) return NextResponse.json({ error: simpleError.message }, { status: 500 })
            return NextResponse.json({ ...simpleData, catalogues: [] })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const body = await request.json()
        const { name, slug, description, image_url, catalogue_ids } = body

        // 1. Update Category info
        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        const { error: catError } = await supabaseAdmin
            .from('categories')
            .update({
                name,
                slug: generatedSlug,
                description,
                image_url
            })
            .eq('id', id)

        if (catError) throw catError

        // 2. Sync Catalogues
        if (catalogue_ids !== undefined) {
            await supabaseAdmin.from('catalogue_categories').delete().eq('category_id', id)
            if (catalogue_ids.length > 0) {
                const junctionData = catalogue_ids.map((cid: string) => ({
                    category_id: id,
                    catalogue_id: cid
                }))
                await supabaseAdmin.from('catalogue_categories').insert(junctionData)
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
        .from('categories')
        .delete()
        .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
