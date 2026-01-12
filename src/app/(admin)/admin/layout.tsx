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
	title: 'Admin panel'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div
			className={`${inter.variable} ${playfairDisplay.variable} antialiased flex flex-col justify-between h-full`}
		>
			<AuthProvider>
				<AdminNavBar />
				{children}
				<Footer />
			</AuthProvider>
		</div>
	)
}
