import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }]
  },
  experimental: {
    outputFileTracingIncludes: {
      "/*": ["./bin/**", "./node_modules/ffmpeg-static/**"]
    }
  }
};

export default withNextIntl(nextConfig);
