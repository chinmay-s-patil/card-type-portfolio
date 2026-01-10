/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CRITICAL: Disable memory-intensive features
  images: {
    unoptimized: true, // Skip image optimization entirely
  },
  
  // Reduce build output size
  output: 'standalone',
  
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
  
  // Optimize webpack for memory
  webpack: (config, { dev, isServer }) => {
    // Disable source maps completely during build
    if (!dev) {
      config.devtool = false;
    }
    
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      // Disable minimization during build to save memory
      // Note: This will increase bundle size but prevent OOM
      minimize: false,
      
      // Aggressive chunk splitting
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    };
    
    // Disable parallelism to reduce memory
    config.parallelism = 1;
    
    // Reduce terser parallelism
    if (!isServer) {
      const TerserPlugin = config.optimization.minimizer?.find(
        plugin => plugin.constructor.name === 'TerserPlugin'
      );
      if (TerserPlugin) {
        TerserPlugin.options.parallel = false;
      }
    }
    
    // Limit memory usage
    config.performance = {
      ...config.performance,
      maxAssetSize: 10000000, // 10MB
      maxEntrypointSize: 10000000,
    };
    
    return config;
  },
  
  // Experimental optimizations
  experimental: {
    // Disable worker threads
    workerThreads: false,
    cpus: 1,
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce page data size
  compress: true,
}

module.exports = nextConfig