'use client'

import { Page, fetchAllPages } from '../api/pages'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NavBar = () => {
	const [pages, setPages] = useState<Page[]>([])

	const pathName = usePathname()

	useEffect(() => {
		async function load() {
			const allPages = await fetchAllPages()
			setPages(allPages)
		}
		load()
	}, [])

	if (!pages.length) return null

	const isActive = (url: string) => pathName === `/${url}`

	// Відокремлюємо Contacts і інші сторінки
	const contactsPage = pages.find(p => p.slug === 'contacts' || p.slug === 'contact')
	const otherPages = pages.filter(
		p => p.slug !== 'contacts' && p.slug !== 'contact' && p.title !== 'Home'
	)

	// Склеюємо, щоб Contacts був останнім
	const navItems = [...otherPages, ...(contactsPage ? [contactsPage] : [])]

	return (
		<nav className='w-full flex flex-wrap items-center gap-x-3 xl:gap-x-7.5 gap-y-3 md:min-w-100 justify-between mx-auto'>
			{navItems.map(item => (
				<Link
					key={item.title}
					href={item.slug}
					className={`tracking-3 hover:text-nav leading-none transform duration-300 ${
						isActive(item.slug) ? 'text-nav' : ''
					}`}
					onClick={e => e.stopPropagation()}
				>
					{item.title}
				</Link>
			))}
		</nav>
	)
}

export default NavBar
