import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function Gallery() {
	return (
		<ProtectedRoute>
			<div>Gallery</div>
		</ProtectedRoute>
	)
}
