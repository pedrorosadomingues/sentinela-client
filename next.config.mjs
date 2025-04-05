import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fashn.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "heroui.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "generations-prod.s3.sa-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
