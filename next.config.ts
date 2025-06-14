
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.app.goo.gl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'proudzanzibartours.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ubtonhgfxcatemfudjqc.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
