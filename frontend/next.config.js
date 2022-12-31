/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        let destination = null
        if (process.env.NODE_ENV == 'development') {
            if (process.env.CODESPACE_NAME != null) {
                destination = `https://${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`
            } else {
                destination = 'http://localhost:3000'
            }
        }
        return [
            {
                source: '/api/:path*',
                destination:
                    'https://mzp-sturdy-space-robot-jjxx6p9pc746-3000.preview.app.github.dev/:path*',
            },
        ]
    },
}

module.exports = nextConfig
