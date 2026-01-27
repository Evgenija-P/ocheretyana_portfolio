import PageEditorWithCloudinary from '@/src/components/PageEditorWithCloudinary'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default async function PageByID({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<ProtectedRoute>
			<PageEditorWithCloudinary id={id} />
		</ProtectedRoute>
	)
}
