import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/estancias', 
  allowedDevOrigins: ['horario.utm.mx', 'https://horario.utm.mx'],
  images: {
    unoptimized: true, 
  },
};

export default nextConfig;