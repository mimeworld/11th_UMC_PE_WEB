import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // TMDB 포스터·배경 이미지를 next/image로 최적화하기 위해 허용한다.
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
};

export default nextConfig;
