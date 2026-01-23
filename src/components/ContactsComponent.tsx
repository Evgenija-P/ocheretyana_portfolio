'use client'
import { fetchAllContacts } from '../api/contacts'

import Spinner from './Spinner'

import { useEffect, useState } from 'react'

export type ContactsFormValues = {
	email: string
	instagram: string
	instaLink: string
}
const ContactsComponent = () => {
	const [contacts, setContacts] = useState<ContactsFormValues[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function load() {
			setLoading(true)
			const allContacts = await fetchAllContacts()
			setContacts(allContacts)
			setLoading(false)
		}
		load()
	}, [])

	if (loading) return <Spinner />

	console.log(contacts)

	return (
		<div className='flex flex-col w-full xl:w-100 gap-y-8 mt-16 xl:mt-0 xl:gap-y-12 mx-auto xl:mb-20'>
			<h1 className='text-xl text-nav font-semibold playfair leading-none'>Let’s talk.</h1>
			<p className='text-xl leading-none'>
				For collaborations and commissions: <br />
				<a
					href={`mailto:${contacts[0].email}`}
					className='hover:underline hover:underline-offset-2 hover:text-nav transform duration-300 text-nav leading-none'
				>
					{contacts[0].email}
				</a>
			</p>

			<p className='text-xl leading-none'>
				Instagram: <br />
				<a
					href={contacts[0].instaLink}
					className='hover:underline hover:underline-offset-2 hover:text-nav transform duration-300 text-nav leading-none'
				>
					{contacts[0].instagram}
				</a>
			</p>
		</div>
	)
}
export default ContactsComponent
