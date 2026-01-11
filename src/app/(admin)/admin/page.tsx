import AllPagesAdmin from '@/src/components/AllPagesAdmin'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function AdminPage() {
	return (
		<ProtectedRoute>
			<main className='w-full h-full min-h-screen'>
				<AllPagesAdmin />
			</main>
		</ProtectedRoute>
	)
}
