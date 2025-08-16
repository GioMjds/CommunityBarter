import '../globals.css';
import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import Providers from '../providers';
import Navbar from '@/layouts/Navbar';
import Footer from '@/layouts/Footer';

const merriweather = Merriweather({
	variable: '--font-merriweather',
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
			<body className={`${merriweather.variable} antialiased`}>
				<Providers>
					<Navbar />
					{children}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
