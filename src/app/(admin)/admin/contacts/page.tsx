import ContactsEditor from '@/src/components/ContactEditor'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function ContactEditorPage() {
	return (
		<ProtectedRoute>
			<main className='w-full h-full'>
				<ContactsEditor />
			</main>
		</ProtectedRoute>
	)
}
