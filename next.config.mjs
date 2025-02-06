import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.fashn.ai',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'heroui.com',
        pathname: '/**',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
