/** @type {import('next').NextConfig} */
const nextConfig = {

  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/antd/ },
      { message: /Accessing element\.ref was removed in React 19/ }
    ];
    return config;
  },
};

export default nextConfig;
