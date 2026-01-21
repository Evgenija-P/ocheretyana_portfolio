/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import { playfairDisplay } from '../app/layout'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type MediaItem = {
	name: string
	type: 'video' | 'photo'
	url: string
	order: number
}

export default function VideoGalleryCanvas({ media }: { media: MediaItem[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	// Сортуємо медіа один раз
	const normalized = useMemo(() => [...media].sort((a, b) => a.order - b.order), [media])

	return (
		<div className='fixed inset-0 flex flex-col items-center justify-center z-0'>
			<div ref={containerRef} className='w-77.5 h-107.5 relative'>
				<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
					<Gallery media={normalized} containerRef={containerRef} />
				</Canvas>
			</div>

			<VideoCaption media={normalized} />
		</div>
	)
}

function Gallery({
	media,
	containerRef
}: {
	media: MediaItem[]
	containerRef: React.RefObject<HTMLDivElement | null>
}) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [nextIndex, setNextIndex] = useState<number | null>(null)
	const [size, setSize] = useState({ w: 0, h: 0 })
	const [transitionProgress, setTransitionProgress] = useState(0)
	const [textures, setTextures] = useState<THREE.Texture[]>([])
	const animationSpeed = 0.05

	// 1️⃣ Завантаження текстур (Фото та Відео)
	useEffect(() => {
		if (media.length === 0) return

		const loader = new THREE.TextureLoader()
		const texs: THREE.Texture[] = new Array(media.length)
		const activeVideos: HTMLVideoElement[] = []

		media.forEach((item, idx) => {
			if (item.type === 'video') {
				const video = document.createElement('video')
				video.src = item.url
				video.crossOrigin = 'anonymous'
				video.loop = true
				video.muted = true
				video.playsInline = true
				video.preload = 'auto'
				video.play().catch(() => {})

				const tex = new THREE.VideoTexture(video)
				tex.colorSpace = THREE.SRGBColorSpace
				texs[idx] = tex
				activeVideos.push(video)
			} else {
				// Завантаження фото
				loader.load(item.url, tex => {
					tex.colorSpace = THREE.SRGBColorSpace
					texs[idx] = tex
					// Оновлюємо стан, коли текстура завантажиться
					setTextures([...texs])
				})
			}
		})

		setTextures(texs)

		return () => {
			texs.forEach(t => t?.dispose())
		}
	}, [media])

	// 2️⃣ Навігація по кліку
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (nextIndex !== null) return
			if (e.clientX < window.innerWidth / 2) {
				setNextIndex((currentIndex - 1 + media.length) % media.length)
			} else {
				setNextIndex((currentIndex + 1) % media.length)
			}
		}
		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [currentIndex, nextIndex, media.length])

	// 3️⃣ Resize
	useEffect(() => {
		if (!containerRef.current) return
		const el = containerRef.current
		const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => ro.disconnect()
	}, [containerRef])

	// 4️⃣ Анімація переходу
	useFrame(() => {
		if (nextIndex !== null) {
			setTransitionProgress(p => {
				const nextP = p + animationSpeed
				if (nextP >= 1) {
					setCurrentIndex(nextIndex)
					setNextIndex(null)
					return 0
				}
				return nextP
			})
		}
	})

	// 5️⃣ Курсор
	useEffect(() => {
		const onMouseMove = (e: MouseEvent) => {
			if (e.clientX < window.innerWidth / 2) {
				document.body.style.cursor = 'url(/images/left.png) 16 16, auto'
			} else {
				document.body.style.cursor = 'url(/images/right.png) 16 16, auto'
			}
		}
		window.addEventListener('mousemove', onMouseMove)
		return () => {
			window.removeEventListener('mousemove', onMouseMove)
			document.body.style.cursor = 'auto'
		}
	}, [])

	return (
		<>
			{textures[currentIndex] && size.w > 0 && (
				<mesh>
					<planeGeometry args={[size.w, size.h]} />
					<meshBasicMaterial
						map={textures[currentIndex]}
						opacity={nextIndex !== null ? 1 - transitionProgress : 1}
						transparent
					/>
				</mesh>
			)}

			{nextIndex !== null && textures[nextIndex] && size.w > 0 && (
				<mesh>
					<planeGeometry args={[size.w, size.h]} />
					<meshBasicMaterial
						map={textures[nextIndex]}
						opacity={transitionProgress}
						transparent
					/>
				</mesh>
			)}
		</>
	)
}

function VideoCaption({ media }: { media: MediaItem[] }) {
	const [index, setIndex] = useState(0)

	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (e.clientX < window.innerWidth / 2) {
				setIndex(prev => (prev - 1 + media.length) % media.length)
			} else {
				setIndex(prev => (prev + 1) % media.length)
			}
		}
		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [media.length])

	return (
		<div className='w-77.5 mt-7 '>
			<p
				className={`min-h-3.5 text-sm text-center xl:text-left w-full tracking-3 leading-none ${playfairDisplay.className}`}
			>
				{media[index]?.name || ' '}
			</p>
		</div>
	)
}
