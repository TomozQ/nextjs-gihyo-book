/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    // styledComponentsの有効化
    styledComponents: true,
  },
}

module.exports = nextConfig
