import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) {
        const authObj = await auth()
        const { userId } = authObj

        if (!userId) {
            const signInUrl = new URL('/sign-in', req.url)
            signInUrl.searchParams.set('redirect_url', req.url)
            return NextResponse.redirect(signInUrl)
        }

        // 1. Fetch user from Clerk API to get the primary email
        let userEmail: string | undefined
        try {
            const client = await clerkClient()
            const user = await client.users.getUser(userId)
            userEmail = (user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
                || user.emailAddresses[0]?.emailAddress)?.toLowerCase()
        } catch (error) {
            console.error('Clerk fetch error:', error)
            return NextResponse.redirect(new URL('/', req.url))
        }

        if (!userEmail) return NextResponse.redirect(new URL('/', req.url))

        // 2. Direct check against Supabase via REST API (Edge compatible & fast)
        try {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
            const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

            const res = await fetch(
                `${supabaseUrl}/rest/v1/admins?email=eq.${userEmail}&is_active=eq.true&select=email`,
                {
                    headers: {
                        'apikey': supabaseKey!,
                        'Authorization': `Bearer ${supabaseKey}`
                    }
                }
            )

            const data = await res.json()

            if (!Array.isArray(data) || data.length === 0) {
                console.warn(`Unauthorized admin access attempt: ${userEmail}`)
                return NextResponse.redirect(new URL('/', req.url))
            }

            // Success - user is a whitelisted admin!
        } catch (error) {
            console.error('Supabase admin check error:', error)
            return NextResponse.redirect(new URL('/', req.url))
        }
    }
})

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}
