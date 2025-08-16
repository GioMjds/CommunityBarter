import '../globals.css';
import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import Providers from '../providers';

const merriweather = Merriweather({
	variable: '--font-merriweather',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: {
		default: 'Palitan Tayo',
		template: "%s - Palitan Tayo!"
	},
	description: 'An Online Platform for Bartering Goods and Services',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${merriweather.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
