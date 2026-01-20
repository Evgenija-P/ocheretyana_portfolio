'use client'

import { playfairDisplay } from '../app/layout'

import { MediaItem } from './PageEditor'

import Image from 'next/image'
import React from 'react'
import 'swiper/css'
import { FreeMode } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface MediaGalleryProps {
	media: MediaItem[]
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
	const getVimeoEmbedUrl = (url: string) => {
		const match = url.match(/vimeo\.com\/(\d+)/)
		if (!match) return url
		// background=1 => убирає UI, autoplay=1, muted=1
		return `https://player.vimeo.com/video/${match[1]}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`
	}

	return (
		<div className='w-full max-w-77.5 mx-auto'>
			<Swiper modules={[FreeMode]} slidesPerView={1} freeMode={{ sticky: true }} grabCursor>
				{media.map((m, idx) => (
					<SwiperSlide key={m.url + idx}>
						<div className='w-full flex flex-col justify-between rounded-lg overflow-hidden h-full'>
							<div className='relative w-full aspect-5/7'>
								{m.type === 'video' ? (
									<iframe
										src={getVimeoEmbedUrl(m.url)}
										title={m.name || 'video'}
										frameBorder='0'
										allow='autoplay; fullscreen'
										className='w-full h-full object-cover pointer-events-none'
									/>
								) : (
									<Image
										src={m.url}
										alt={m.name || 'image'}
										fill
										className='object-cover'
									/>
								)}
							</div>

							{m.name && (
								<p
									className={`text-sm text-center xl:text-left w-full mt-7 tracking-3 leading-none ${playfairDisplay.className}`}
								>
									{m.name}
								</p>
							)}
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default MediaGallery
