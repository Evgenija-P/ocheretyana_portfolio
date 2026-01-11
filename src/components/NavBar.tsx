'use client'

import { Page, fetchAllPages } from '../api/pages'

import Spinner from './Spinner'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const NavBar = () => {
	const [pages, setPages] = useState<Page[]>([])
	const [loading, setLoading] = useState(true)
	const pathName = usePathname()

	useEffect(() => {
		async function load() {
			setLoading(true)
			const allPages = await fetchAllPages()
			setPages(allPages)
			setLoading(false)
		}
		load()
	}, [])

	if (loading) return <Spinner />
	if (!pages.length) return null

	const isActive = (url: string) => pathName === url

	// Відокремлюємо Contacts і інші сторінки
	const contactsPage = pages.find(p => p.slug === 'contacts')
	const otherPages = pages.filter(p => p.slug !== 'contacts' && p.title !== 'Home')

	// Склеюємо, щоб Contacts був останнім
	const navItems = [...otherPages, ...(contactsPage ? [contactsPage] : [])]

	return (
		<nav className='flex items-center gap-x-3 xl:gap-x-7.5'>
			{navItems.map(item => (
				<Link
					key={item.title}
					href={item.slug}
					className={`xl:text-xl hover:text-nav transform duration-300 ${
						isActive(item.slug) ? 'text-nav' : ''
					}`}
				>
					{item.title}
				</Link>
			))}
		</nav>
	)
}

export default NavBar
