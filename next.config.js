/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@radix-ui/react-dropdown-menu"],
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig 