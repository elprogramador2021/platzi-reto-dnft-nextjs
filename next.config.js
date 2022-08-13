/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

/*
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false }

        return config
    },
}
*/

module.exports = nextConfig
