/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config, { webpack }) => {
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

module.exports = nextConfig
