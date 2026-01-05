type Params = { slug: string }

export default async function SlugPage({ params }: { params: Promise<Params> }) {
	const { slug } = await params
	return (
		<main className='w-full h-full max-h-screen flex flex-col gap-y-10'>SlugPage {slug}</main>
	)
}
