import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Otimizações de performance
	compress: true,
	productionBrowserSourceMaps: false,

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "www.camara.leg.br",
			},
			{
				protocol: "https",
				hostname: "picsum.photos",
			},
		],
		// Otimizar imagens
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		minimumCacheTTL: 31536000,
	},

	experimental: {
		// Ativa optimized package imports (tree-shaking melhorado)
		optimizePackageImports: ["lucide-react", "@radix-ui/react-*"],
	},
};

export default nextConfig;
