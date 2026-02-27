/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude FFmpeg binaries from server bundle (works with both Turbopack and Webpack)
  serverExternalPackages: ['@ffmpeg-installer/ffmpeg', 'fluent-ffmpeg'],
};

export default nextConfig;
