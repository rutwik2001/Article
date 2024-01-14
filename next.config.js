const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env:{
      JWT : process.env.JWT,
      Web3_Endpoint : process.env.Web3_Endpoint
    },
  
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
        };
      }
  
      return config;
    },
  };
  
  module.exports = nextConfig;
  