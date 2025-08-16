import '../globals.css';
import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import Providers from '../providers';

const oswald = Oswald({
	variable: '--font-oswald',
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
			<body className={`${oswald.variable} antialiased`}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
