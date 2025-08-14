import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com'
			}
		]
	},
	serverExternalPackages: ['@prisma/client'],
	output: 'standalone',
	experimental: {
		globalNotFound: true
	}
};

export default nextConfig;
