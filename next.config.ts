import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-left", // or "top-left", "top-right", etc.
    appIsrStatus: false,
  },
  // ...other config options
};

export default nextConfig;
