/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.bing.net',
            },
            {
                protocol: 'https',
                hostname: '**.com',
            },
        ],
    },
}

export default nextConfig
