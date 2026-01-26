/** @type {import('next').NextConfig} */
const nextConfig = {
    // Externalize @react-pdf/renderer to avoid bundling issues in serverless
    serverExternalPackages: ['@react-pdf/renderer'],

    // Next's server bundles can run without `react` in `node_modules` because Next ships its own
    // internal React runtime. Our PDF path intentionally loads the real `react` package (standard
    // `react.element`) to stay compatible with @react-pdf/renderer, so we must force it into output
    // file tracing for standalone/serverless deployments.
    outputFileTracingIncludes: {
        '**': [
            'node_modules/react/**',
            'node_modules/react-dom/**',
            'node_modules/scheduler/**',
        ],
    },

    // Empty turbopack config to acknowledge Turbopack usage
    turbopack: {},
};

module.exports = nextConfig;
