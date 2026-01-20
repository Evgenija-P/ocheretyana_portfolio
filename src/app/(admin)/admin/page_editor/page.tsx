import PageEditorWithCloudinary from '@/src/components/PageEditorWithCloudinary'
import ProtectedRoute from '@/src/components/ProtectedRoute'

export default function Editor() {
	return (
		<ProtectedRoute>
			<main className='w-full h-full'>
				<PageEditorWithCloudinary />
			</main>
		</ProtectedRoute>
	)
}
