/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    poweredByHeader: false,
    images: {
        // Serve AVIF (smallest) with WebP fallback for all optimized images.
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
};

module.exports = nextConfig;
