import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('categories')
            .select(`
                *,
                catalogues:catalogue_categories(
                    catalogue:catalogues(*)
                )
            `)
            .order('name', { ascending: true })

        if (error) {
            // Fallback if catalogue_categories table is missing
            if (error.code === 'PGRST116' || error.message.includes('catalogue_categories')) {
                const { data: simpleData, error: simpleError } = await supabaseAdmin
                    .from('categories')
                    .select('*')
                    .order('name', { ascending: true })

                if (simpleError) throw simpleError
                return NextResponse.json(simpleData.map(c => ({ ...c, catalogues: [] })))
            }
            throw error
        }
        return NextResponse.json(data)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, slug, description, image_url, catalogue_ids } = body

        // 1. Create Category
        const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        const { data: category, error: catError } = await supabaseAdmin
            .from('categories')
            .insert([{
                name,
                slug: generatedSlug,
                description,
                image_url
            }])
            .select()
            .single()

        if (catError) throw catError

        // 2. Add Catalogues if any
        if (catalogue_ids && catalogue_ids.length > 0) {
            const junctionData = catalogue_ids.map((cid: string) => ({
                category_id: category.id,
                catalogue_id: cid,
            }))
            const { error: jError } = await supabaseAdmin
                .from('catalogue_categories')
                .insert(junctionData)

            if (jError) throw jError
        }

        return NextResponse.json(category)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

