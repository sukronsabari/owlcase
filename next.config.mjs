/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "utfs.io" },
      { hostname: "api.sandbox.midtrans.com" },
      { hostname: "api.sandbox.veritrans.co.id" },
    ],
  },
};

export default nextConfig;
