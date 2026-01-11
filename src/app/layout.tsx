import './globals.css'

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

export const playfairDisplay = Playfair_Display({
	variable: '--font-playfair-display',
	subsets: ['latin']
})

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Ocheretyana Olga | Videographer | Slow Travel | Europe',
	description: 'Videographer | Slow Travel | Europe'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' className={inter.className}>
			<body
				className={`${inter.variable} ${playfairDisplay.variable} antialiased flex flex-col justify-between`}
			>
				{children}
			</body>
		</html>
	)
}
