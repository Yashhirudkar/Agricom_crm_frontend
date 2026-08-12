import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    'localhost:3000',
    ...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS
      ? process.env.NEXT_PUBLIC_ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
      : [])
  ],
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;


