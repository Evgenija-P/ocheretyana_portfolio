import { fetchPageBySlug } from '@/src/api/pages'
import BaseSection from '@/src/components/BaseSection'
import VideoGalleryCanvas from '@/src/components/VideoGalleryCanvas'

export default async function Main() {
	const page = await fetchPageBySlug('home')

	if (!page) {
		return (
			<main className='w-full h-full max-h-screen flex flex-col gap-y-10'>
				<BaseSection className='flex flex-col xl:flex-row gap-5 xl:gap-30 items-center pb-20 '>
					<p>Сторінку не знайдено</p>
				</BaseSection>
			</main>
		)
	}

	return (
		<main className='w-full h-full max-h-screen flex flex-col gap-y-10'>
			<BaseSection className='flex flex-col items-center justify-center'>
				{page?.media.length > 0 && <VideoGalleryCanvas media={page.media} />}
			</BaseSection>
		</main>
	)
}
