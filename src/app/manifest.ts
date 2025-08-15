import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
        name: "Palitan Tayo!",
        description: "An Online Platform for Bartering Goods and Services",
        start_url: "/",
        display: "standalone",
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon'
            }
        ]
	};
}