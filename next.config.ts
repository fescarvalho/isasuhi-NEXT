/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // CUIDADO: Isso libera qualquer imagem. Em produção, liste os domínios específicos (ex: imgur.com, drive.google.com)
      },
    ],
  },
};

export default nextConfig;