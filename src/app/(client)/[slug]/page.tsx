import { fetchPageBySlug } from '@/src/api/pages'
import BaseSection from '@/src/components/BaseSection'
import MediaGallery from '@/src/components/MediaGallery'

type Params = { slug: string }

export default async function SlugPage({ params }: { params: Promise<Params> }) {
	const { slug } = await params
	const page = await fetchPageBySlug(slug)

	if (!page) {
		return (
			<main className='w-full h-full flex flex-col items-center justify-center gap-y-10'>
				<BaseSection className='flex flex-col xl:flex-row gap-5 xl:gap-30 items-center pb-20 '>
					<p>Сторінку не знайдено</p>
				</BaseSection>
			</main>
		)
	}

	return (
		<main className='w-full h-full flex flex-col items-center justify-center gap-y-10'>
			<BaseSection className='flex flex-col items-center justify-center'>
				{page.media.length > 0 && <MediaGallery media={page.media} />}
			</BaseSection>
		</main>
	)
}
