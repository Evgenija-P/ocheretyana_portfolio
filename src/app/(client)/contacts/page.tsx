import BaseSection from '@/src/components/BaseSection'
import ContactsGallery from '@/src/components/ContactsGallery'

import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Contacts'
}
const Contacts = () => {
	return (
		<main className='w-full h-full'>
			<BaseSection className='flex flex-col xl:flex-row gap-5 xl:gap-15 items-center pb-20'>
				<div className='min-w-87 max-w-88 order-2 xl:order-1'>
					<ContactsGallery />
				</div>
				<div className='flex flex-col max-w-120 gap-y-12 order-1 xl:order-2'>
					<h1 className='text-xl text-nav font-semibold playfair'>Let’s talk.</h1>
					<p className='text-xl font-semibold playfair'>
						For collaborations, commissions or just to say hello: <br />
						<a
							href='mailto:hello@ocheretyana.com'
							className='hover:underline hover:underline-offset-2 hover:text-nav transform duration-300 text-nav'
						>
							hello@ocheretyana.com
						</a>
					</p>

					<p className='text-xl font-semibold playfair'>
						Instagram: <br />
						<a
							href='https://www.instagram.com/travelimpressionist'
							className='hover:underline hover:underline-offset-2 hover:text-nav transform duration-300 text-nav'
						>
							@travelimpressionist
						</a>
					</p>
				</div>
			</BaseSection>
		</main>
	)
}
export default Contacts
