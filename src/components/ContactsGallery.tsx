'use client'

import { Page, fetchAllPages } from '../api/pages'

import MediaGallery from './MediaGallery'

import { useEffect, useState } from 'react'

const ContactsGallery = () => {
	const [pages, setPages] = useState<Page[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function load() {
			setLoading(true)
			const allPages = await fetchAllPages()
			setPages(allPages)
			setLoading(false)
		}
		load()
	}, [])

	const media = pages.find(page => page.slug === 'contacts')?.media

	if (!media) return null

	return (
		media && (
			<div className='max-w-88 order-2 xl:order-1'>
				<MediaGallery media={media} />
			</div>
		)
	)
}
export default ContactsGallery
