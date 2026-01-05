'use client'
import { db } from '../services/firebase'

import { PageFormValues } from './PageEditor'

import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const AllPagegAdmin = () => {
	const [pages, setPages] = useState<PageFormValues[]>([])

	useEffect(() => {
		async function loadAll() {
			const querySnap = await getDocs(collection(db, 'pages')) // всі документи
			const allPages = querySnap.docs.map(doc => ({
				id: doc.id,
				...doc.data()
			})) as (PageFormValues & { id: string })[]
			setPages(allPages)
		}

		loadAll()
	}, [])

	console.log('pages', pages)
	return <div>AllPagegAdmin</div>
}
export default AllPagegAdmin
