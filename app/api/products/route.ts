import { NextResponse } from 'next/server'
import { supabaseAdmin, isAdminClient } from '@/lib/supabase'

export async function POST(request: Request) {
    if (!isAdminClient) {
        return NextResponse.json({ error: 'Admin configuration missing' }, { status: 500 })
    }

    try {
        const body = await request.json()
        const {
            name, slug, description, base_price, gender, category_id, is_featured, stock_quantity,
            images, variants
        } = body

        if (!name || isNaN(parseFloat(base_price))) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // 1. Create Product
        const { data: product, error: pError } = await supabaseAdmin
            .from('products')
            .insert([{
                name,
                slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
                description: description || '',
                base_price: parseFloat(base_price),
                gender: gender || null,
                category_id: category_id || null,
                is_featured: !!is_featured,
                stock_quantity: parseInt(stock_quantity) || 0
            }])
            .select()
            .single()

        if (pError) throw pError

        // 2. Add Images
        if (Array.isArray(images) && images.length > 0) {
            const imageData = images
                .filter(url => typeof url === 'string' && url.length > 0)
                .map((url, i) => ({
                    product_id: product.id,
                    image_url: url,
                    is_primary: i === 0,
                    display_order: i
                }))

            if (imageData.length > 0) {
                const { error: imgError } = await supabaseAdmin.from('product_images').insert(imageData)
                if (imgError) console.error('Image upload sync error:', imgError)
            }
        }

        // 3. Add Variants
        if (Array.isArray(variants) && variants.length > 0) {
            const variantData = variants
                .filter(v => v.size || v.color)
                .map(v => ({
                    product_id: product.id,
                    size: v.size || null,
                    color: v.color || null,
                    stock: parseInt(v.stock) || 0
                }))

            if (variantData.length > 0) {
                const { error: varError } = await supabaseAdmin.from('product_variants').insert(variantData)
                if (varError) console.error('Variant sync error:', varError)
            }
        }

        return NextResponse.json({ success: true, product })
    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const catalogue = searchParams.get('catalogue') || searchParams.get('collection')
    const gender = searchParams.get('gender')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')
    const slug = searchParams.get('slug')
    const sortBy = searchParams.get('sortBy') || 'newest'

    let query = supabaseAdmin
        .from('products')
        .select(`
            *,
            images:product_images(*),
            category:categories(*),
            variants:product_variants(*)
        `)

    if (slug) query = query.eq('slug', slug)
    if (gender) query = query.eq('gender', gender)
    if (minPrice) query = query.gte('base_price', parseFloat(minPrice))
    if (maxPrice) query = query.lte('base_price', parseFloat(maxPrice))
    if (search) query = query.ilike('name', `%${search}%`)

    if (category) {
        // Check if category is a UUID or a slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(category)
        if (isUUID) {
            query = query.eq('category_id', category)
        } else {
            // It's a slug, we need to find the category ID first
            // Note: In Supabase regular SDK we could use !inner, but here we can just do a quick lookup
            const { data: catData } = await supabaseAdmin
                .from('categories')
                .select('id')
                .eq('slug', category)
                .single()

            if (catData) {
                query = query.eq('category_id', catData.id)
            } else {
                // Category not found by slug, return empty
                return NextResponse.json([])
            }
        }
    }

    // Simple sorting
    if (sortBy === 'price-asc') query = query.order('base_price', { ascending: true })
    else if (sortBy === 'price-desc') query = query.order('base_price', { ascending: false })
    else if (sortBy === 'featured') query = query.order('is_featured', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Filter by catalogue manually if needed, or join
    let filteredData = data || []
    if (catalogue) {
        // Filter products that belong to this catalogue/collection
        // Note: In a larger app, this would be a proper join query
        const { data: catMap } = await supabaseAdmin
            .from('product_catalogues')
            .select('product_id, catalogue:catalogues!inner(slug)')
            .eq('catalogue.slug', catalogue)

        if (catMap) {
            const allowedIds = catMap.map(m => m.product_id)
            filteredData = filteredData.filter(p => allowedIds.includes(p.id))
        }
    }

    return NextResponse.json(filteredData)
}
