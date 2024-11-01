/** @type {import('next').NextConfig} */
//이미지호스팅 사용시 remotePatterns에 hostname추가
const nextConfig = {
  images: { remotePatterns: [{ hostname: "res.cloudinary.com" }] },
};

export default nextConfig;
