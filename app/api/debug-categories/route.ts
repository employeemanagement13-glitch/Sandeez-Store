import { NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    // 1. Check Categories (Public Client)
    const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')

    // 2. Check Categories (Admin Client - to see if RLS is the issue)
    const { data: categoriesAdmin, error: catAdminError } = await supabaseAdmin
        .from('categories')
        .select('*')

    // 3. Check Admins (Admin Client)
    const { data: admins, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('*')

    return NextResponse.json({
        source: 'Debug Route v2',
        public_categories: { count: categories?.length, data: categories, error: catError },
        admin_categories: { count: categoriesAdmin?.length, data: categoriesAdmin, error: catAdminError },
        admins_table: { count: admins?.length, data: admins, error: adminError }
    })
}
