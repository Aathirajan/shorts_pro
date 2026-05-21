/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client',
      'bcryptjs',
      '@remotion/renderer', // ✅ ADD THIS
    ],
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },

  webpack: (config) => {
    // ✅ Prevent bundling Remotion native binaries
    config.externals.push({
      '@remotion/renderer': 'commonjs @remotion/renderer',
    });

    return config;
  },
};

module.exports = nextConfig;