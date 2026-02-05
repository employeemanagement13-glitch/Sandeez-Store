import { NextResponse } from 'next/server'
import { supabaseAdmin, isAdminClient } from '@/lib/supabase'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { data, error } = await supabaseAdmin
        .from('products')
        .select(`
            *,
            images:product_images(*),
            variants:product_variants(*),
            category:categories(*)
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

    // Handle order items fk
    await supabaseAdmin.from('order_items').update({ product_id: null }).eq('product_id', id)

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAdminClient) return NextResponse.json({ error: 'Config error' }, { status: 500 })
    const { id } = await params
    try {
        const body = await request.json()
        const {
            name, slug, description, base_price, gender, category_id, is_featured, stock_quantity,
            images, variants
        } = body

        // 1. Update Product
        const { error: pError } = await supabaseAdmin
            .from('products')
            .update({
                name,
                slug,
                description,
                base_price: parseFloat(base_price),
                gender: gender || null,
                category_id: category_id || null,
                is_featured: !!is_featured,
                stock_quantity: parseInt(stock_quantity) || 0
            })
            .eq('id', id)

        if (pError) throw pError

        // 2. Sync Images
        if (images && Array.isArray(images)) {
            await supabaseAdmin.from('product_images').delete().eq('product_id', id)
            const imageData = images
                .filter(url => url)
                .map((url, i) => ({
                    product_id: id,
                    image_url: url,
                    is_primary: i === 0,
                    display_order: i
                }))
            if (imageData.length > 0) await supabaseAdmin.from('product_images').insert(imageData)
        }

        // 3. Sync Variants
        if (variants && Array.isArray(variants)) {
            await supabaseAdmin.from('product_variants').delete().eq('product_id', id)
            const variantData = variants
                .filter(v => v.size || v.color)
                .map(v => ({
                    product_id: id,
                    size: v.size || null,
                    color: v.color || null,
                    stock: parseInt(v.stock) || 0
                }))
            if (variantData.length > 0) await supabaseAdmin.from('product_variants').insert(variantData)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
