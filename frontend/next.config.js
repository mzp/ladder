/** @type {import('next').NextConfig} */

let apiRoot = null
if (process.env.NODE_ENV == 'development') {
    if (process.env.CODESPACE_NAME != null) {
        apiRoot = `https://${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`
    } else {
        apiRoot = 'https://api.localhost.letsrss.com:8443'
    }
}

const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiRoot: apiRoot,
    },
}

module.exports = nextConfig
