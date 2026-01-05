import PageEditor from '@/src/components/PageEditor'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function Editor() {
	return (
		<ProtectedRoute>
			<main className='w-full h-full min-h-screen'>
				<PageEditor />
			</main>
		</ProtectedRoute>
	)
}
