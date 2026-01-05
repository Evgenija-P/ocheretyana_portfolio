'use client'

import { auth } from '../services/firebase'

import { signOut } from 'firebase/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AdminNavBar = () => {
	const pathName = usePathname()
	const menu = [
		{ title: 'Admin', url: '/admin' },
		{ title: 'Editor', url: '/admin/page_editor' }
		// { title: 'Gallery', url: '/admin/gallery' }
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

	async function handleLogout() {
		try {
			await signOut(auth)
			console.log('User logged out')
			// тут можна зробити редірект, наприклад:
			// router.push('/login')
		} catch (error) {
			console.error('Logout error', error)
		}
	}

	return (
		<header className='w-full py-10 flex items-center justify-center gap-x-15'>
			<nav className='flex items-center gap-x-7.5 justify-center'>
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
			<button onClick={handleLogout} className='w-fit h-8 px-8 py-4 base-buttons'>
				Logout
			</button>
		</header>
	)
}

export default AdminNavBar
