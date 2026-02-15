import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  devIndicators: {
    // @ts-ignore - these properties exist in runtime but are missing from type definition
    appIsrStatus: false,
    buildActivity: false,
  },
};

export default nextConfig;
