'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavBar = () => {
	const pathName = usePathname()
	const menu = [
		{ title: 'Travel', url: '/travel' },
		{ title: 'Fashion', url: '/fashion' },
		{ title: 'Arts & Culture', url: '/arts_culture' },
		{ title: 'Contacts', url: '/contacts' }
	]

	const isActive = (url: string) => {
		return pathName === url
	}
	return (
		<nav className='flex items-center gap-x-7.5'>
			{menu.map(item => (
				<Link
					key={item.title}
					href={item.url}
					className={`text-xl hover:text-nav transform duration-300 ${isActive(item.url) ? 'text-nav' : ''}`}
				>
					{item.title}
				</Link>
			))}
		</nav>
	)
}
export default NavBar
