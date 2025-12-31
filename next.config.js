/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Reduce memory usage during build
  experimental: {
    // Reduce worker threads
    workerThreads: false,
    cpus: 1
  },
  
  // Disable image optimization during build (images are already optimized)
  images: {
    unoptimized: true
  },
  
  // Reduce bundle size
  output: 'standalone',
  
  // Optimize webpack for memory
  webpack: (config, { isServer }) => {
    // Reduce memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
      // Split chunks to reduce memory usage
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
    }
    
    // Reduce parallelism to save memory
    if (!isServer) {
      config.optimization.minimizer = config.optimization.minimizer.map(plugin => {
        if (plugin.constructor.name === 'TerserPlugin') {
          return {
            ...plugin,
            options: {
              ...plugin.options,
              parallel: false, // Disable parallel processing to save memory
            }
          }
        }
        return plugin
      })
    }
    
    return config
  }
}

module.exports = nextConfig