import './globals.css';
import { Metadata } from "next";
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({
    variable: '--font-merriweather',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: '404 - Not Found',
    description: 'The page you are looking for does not exist.',
};

export default function GlobalNotFound() {
    return (
        <html lang='en'>
            <body className={`${merriweather.variable} antialiased`}>
                <h1>404 - Not Found</h1>
                <p>The page you are looking for does not exist.</p>
            </body>
        </html>
    )
}