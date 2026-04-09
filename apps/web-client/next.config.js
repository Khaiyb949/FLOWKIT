// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nx/next');

/** 
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
  reactStrictMode: true,       // Bật Strict Mode React
  nx: {},                      // Nx-specific config nếu cần
  images: {
    remotePatterns: [          // Thay thế images.domains bằng remotePatterns
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {},            // Xóa key không hợp lệ "appDir"
  compiler: {
    styledComponents: true     // ví dụ nếu dùng styled-components
  },
  typescript: {
    ignoreBuildErrors: false  // Không build khi TS lỗi
  }
};

// Nếu chỉ dùng withNx thì không cần composePlugins
module.exports = withNx(nextConfig);