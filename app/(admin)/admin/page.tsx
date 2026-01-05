import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function AdminPage() {
	return (
		<ProtectedRoute>
			<main className='w-full h-full min-h-screen'>AdminPage</main>
		</ProtectedRoute>
	)
}
