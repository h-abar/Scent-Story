/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // السماح بعرض الصور المرفوعة محليًا وكذلك صور placeholder خارجية
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  // مكان التخزين المحلي على Railway: /data/uploads (volume)
  // في التطوير المحلي سيتم استخدامه كـ relative path يُخدّم عبر Next
};

export default nextConfig;
