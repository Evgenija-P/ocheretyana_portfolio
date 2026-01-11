import '../../globals.css'

import AdminNavBar from '@/src/components/AdminNavBar'
import Footer from '@/src/components/Footer'
import { AuthProvider } from '@/src/contexts/AuthContext'

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

export const playfairDisplay = Playfair_Display({
	variable: '--font-playfair-display',
	subsets: ['latin']
})

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Ocheretyana',
	description: 'Portfolio by Ocheretyana'
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
				<AuthProvider>
					<AdminNavBar />
					{children}
					<Footer />
				</AuthProvider>
			</body>
		</html>
	)
}
