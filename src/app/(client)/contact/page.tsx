import BaseSection from '@/src/components/BaseSection'
import ContactsComponent from '@/src/components/ContactsComponent'

import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Contacts'
}

const Contacts = () => {
	return (
		<main className='w-full h-full flex flex-col gap-y-10 items-center justify-center'>
			<BaseSection className=''>
				<ContactsComponent />
			</BaseSection>
		</main>
	)
}
export default Contacts
