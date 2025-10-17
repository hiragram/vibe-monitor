/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.ELECTRON_BUILD ? 'export' : undefined,
  images: {
    unoptimized: process.env.ELECTRON_BUILD ? true : false,
  },
}

module.exports = nextConfig
