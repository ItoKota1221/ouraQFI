import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // ワークスペースルート誤検知の抑制
  outputFileTracingRoot: __dirname,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
};

export default nextConfig;
