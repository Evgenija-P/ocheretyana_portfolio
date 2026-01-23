import { fetchPageBySlug } from '@/src/api/pages'
import MainComponent from '@/src/components/Main'
import OldVideoGalleryCanvas from '@/src/components/OldVideoCanvas'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Main() {
	const page = await fetchPageBySlug('home')

	if (!page) {
		return (
			<MainComponent>
				<p>Сторінку не знайдено</p>
			</MainComponent>
		)
	}

	return (
		<MainComponent>
			{page?.media.length > 0 && <OldVideoGalleryCanvas media={page.media} />}
		</MainComponent>
	)
}
