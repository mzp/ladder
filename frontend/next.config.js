/** @type {import('next').NextConfig} */

function isEmpty(str) {
    return (!str || str.length === 0 );
}

let apiRoot = 'https://api.letsrss.com'

const { NODE_ENV, CODESPACE_NAME, API_ROOT } = process.env
if (NODE_ENV == 'development') {
    if (!isEmpty(CODESPACE_NAME)) {
        apiRoot = `https://${CODESPACE_NAME}-3000.preview.app.github.dev`
    } else if (!isEmpty(API_ROOT)) {
        apiRoot = API_ROOT
    } else {
        apiRoot = 'https://api.letsrss.com'
    }
}

const nextConfig = {
    reactStrictMode: true,
    publicRuntimeConfig: {
        apiRoot: apiRoot,
        development: NODE_ENV == 'development'
    },
}

module.exports = nextConfig
