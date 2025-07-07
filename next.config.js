/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingExcludes: {
    '/flaskApi': [
      "node_modules/**",
      ".next/**",
      ".vercel/**",
      "app/**",
      "pages/**",
      "public/**",
      "flaskApi/venv/**",
      "flaskApi/.venv/**"
    ],
  },
  rewrites: async () => {
    return [
      {
        // ✅ Proxy all other /api/* routes to your Flask backend
        source: '/flaskApi/:path((?!auth).*)',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'https://127.0.0.1:5328/flaskApi/:path*'
            : '/flaskApi/',
      },
    ]
  },
  webpack: (config, { webpack, isServer }) => {
    // Fix for MUI
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        {
          '@mui/icons-material': 'commonjs @mui/icons-material',
        },
      ];
    }

    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals["node:fs"] = "commonjs node:fs";
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    config.plugins.push(

      new webpack.NormalModuleReplacementPlugin(
        /^node:/,
        (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        },
      ),
    );

    return config;
  }
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);