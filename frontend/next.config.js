/** @type {import('next').NextConfig} */

let apiRoot = 'https://api.letsrss.com'
if (process.env.NODE_ENV == 'development') {
    if (process.env.CODESPACE_NAME != null) {
        apiRoot = `https://${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`
    } else if (process.env.API_ROOT != null) {
        apiRoot = process.env.API_ROOT
    } else {
        apiRoot = 'https://api.letsrss.com'
    }
}

const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiRoot: apiRoot,
development: process.env.NODE_ENV == 'development'
    },
}

module.exports = nextConfig
