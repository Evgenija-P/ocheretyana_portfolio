import { PageFormValues } from '@/components/PageEditor'

import { db } from '@/services/firebase'

import { collection, getDocs } from 'firebase/firestore'

export type Page = PageFormValues & { id: string }

export async function fetchAllPages(): Promise<Page[]> {
	const querySnap = await getDocs(collection(db, 'pages'))
	const allPages = querySnap.docs.map(doc => ({
		id: doc.id,
		...doc.data()
	})) as Page[]
	return allPages
}
