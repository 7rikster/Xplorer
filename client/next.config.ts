import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "lh3.googleusercontent.com",
    ],
  },
  ssr: {
    noExternal: [/@syncfusion/],
  },
};

export default nextConfig;
