'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminNavBar = () => {
	const pathName = usePathname()
	const menu = [
		{ title: 'Admin', url: '/admin' },
		{ title: 'Editor', url: '/admin/page_editor' },
		{ title: 'Gallery', url: '/admin/gallery' }
	]

	// вибираємо найточніший match
	const getActiveUrl = () => {
		let active: string | null = null
		menu.forEach(item => {
			if (pathName === item.url || pathName.startsWith(item.url + '/')) {
				if (!active || item.url.length > active.length) {
					active = item.url
				}
			}
		})
		return active
	}

	const activeUrl = getActiveUrl()

	return (
		<header className='w-full mx-auto py-10'>
			<nav className='flex items-center gap-x-7.5 mx-auto justify-center'>
				{menu.map(item => (
					<Link
						key={item.title}
						href={item.url}
						className={`text-xl hover:text-nav transform duration-300 ${activeUrl === item.url ? 'text-nav font-semibold' : ''}`}
					>
						{item.title}
					</Link>
				))}
			</nav>
		</header>
	)
}

export default AdminNavBar
