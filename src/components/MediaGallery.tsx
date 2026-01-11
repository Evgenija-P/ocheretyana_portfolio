'use client'

import { MediaItem } from './PageEditor'

import Image from 'next/image'
import React from 'react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface MediaGalleryProps {
	media: MediaItem[]
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
	const getVimeoEmbedUrl = (url: string) => {
		const match = url.match(/vimeo\.com\/(\d+)/)
		return match ? `https://player.vimeo.com/video/${match[1]}` : url
	}

	return (
		<div className='w-full max-w-77.5 h-full mx-auto'>
			<Swiper
				modules={[FreeMode]}
				slidesPerView={1}
				grabCursor
				freeMode={{ sticky: true }}
				className='w-full h-full'
			>
				{media.map((m, idx) => (
					<SwiperSlide key={m.url + idx}>
						<div className='w-full h-full relative flex flex-col rounded-lg overflow-hidden'>
							{/* Верхній блок для медіа */}
							<div className='relative flex-1 w-full'>
								{/* overlay для свайпу відео */}
								{m.type === 'video' && (
									<div
										className='absolute inset-0 z-10'
										onClick={e => e.currentTarget.remove()} // прибираємо overlay при кліку
									/>
								)}

								{m.type === 'video' ? (
									<iframe
										src={getVimeoEmbedUrl(m.url)}
										title={`Vimeo Video ${m.url}`}
										frameBorder='0'
										allow='autoplay; fullscreen; picture-in-picture'
										allowFullScreen
										className='w-full aspect-5/7 object-cover relative z-0'
									/>
								) : (
									<Image
										src={m.url}
										alt={m.name || 'image'}
										width={310}
										height={430}
										// fill
										className='object-cover relative z-0'
									/>
								)}
							</div>

							{/* Текст під медіа */}
							{m.name && (
								<p className='w-full text-center font-semibold mt-2'>{m.name}</p>
							)}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default MediaGallery
