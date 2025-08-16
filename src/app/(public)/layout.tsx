import '../globals.css';
import type { Metadata } from 'next';
import { Oswald } from 'next/font/google';
import Providers from '../providers';
import Navbar from '@/layouts/Navbar';
import Footer from '@/layouts/Footer';

const oswald = Oswald({
	variable: '--font-oswald',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Palitan Tayo!',
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
				<Providers>
					<Navbar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
