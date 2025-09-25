import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ワークスペースルート誤検知の抑制
  experimental: {
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
