/** @type {import('next').NextConfig} */
const nextConfig = {
    // Externalize @react-pdf/renderer to avoid bundling issues in serverless
    serverExternalPackages: ['@react-pdf/renderer'],

    // Empty turbopack config to acknowledge Turbopack usage
    turbopack: {},
};

module.exports = nextConfig;
