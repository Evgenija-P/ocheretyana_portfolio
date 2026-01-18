import { db } from '@/services/firebase'

import { ContactsFormValues } from '../components/ContactsComponent'

import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'

export type Contacts = ContactsFormValues & { id: string }

export async function fetchAllContacts(): Promise<Contacts[]> {
	const querySnap = await getDocs(collection(db, 'contacts'))
	const allContacts = querySnap.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Contacts[]

	return allContacts
}

export async function fetchContacts(): Promise<Contacts> {
	const querySnap = await getDocs(collection(db, 'contacts'))
	const allContacts = querySnap.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Contacts[]
	return allContacts[0]
}

/**
 * Оновлює email та instagram для першого контакту у колекції
 */
export async function updateContacts(values: ContactsFormValues) {
	const querySnap = await getDocs(collection(db, 'contacts'))
	if (querySnap.empty) throw new Error('No contacts document found')

	const contactDoc = querySnap.docs[0] // беремо перший документ
	const docRef = doc(db, 'contacts', contactDoc.id)

	await updateDoc(docRef, {
		email: values.email,
		instagram: values.instagram
	})
}
