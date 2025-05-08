// next.config.mjs
import path from 'path';

/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Only if using Next.js 14+ app router
  },
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    return config;
  },
};
