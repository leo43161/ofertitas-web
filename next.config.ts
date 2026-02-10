import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // <--- LA CLAVE PARA ESTÁTICO
  images: {
    unoptimized: true, // Importante: Next/Image sin servidor no funciona por defecto
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '10.20.20.5', // O tu IP pública
        pathname: '/ofertitas_api2/public/**',
      },
    ],
  },
  // Desactivar trailing slash ayuda con algunos hostings estáticos
  trailingSlash: true,
};

export default nextConfig;
