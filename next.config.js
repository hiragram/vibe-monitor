/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.ELECTRON_BUILD ? 'export' : undefined,
  assetPrefix: process.env.ELECTRON_BUILD ? './' : undefined,
  images: {
    unoptimized: process.env.ELECTRON_BUILD ? true : false,
  },
}

module.exports = nextConfig
