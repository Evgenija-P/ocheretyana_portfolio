/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import { playfairDisplay } from '../app/layout'

import { MediaItem } from './PageEditor'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function VideoGalleryCanvas({ media }: { media: MediaItem[] }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const normalized = [...media].sort((a, b) => a.order - b.order)
	const videos = normalized.map(m => m.url) ?? []

	return (
		<div className='fixed inset-0 flex flex-col items-center justify-center z-0'>
			<div ref={containerRef} className='w-77.5 h-107.5 relative'>
				<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
					<Gallery videos={videos} containerRef={containerRef} />
				</Canvas>
			</div>

			{/* 🔹 Підпис під відео */}
			<VideoCaption media={normalized} />
		</div>
	)
}

function Gallery({
	videos,
	containerRef
}: {
	videos: string[]
	containerRef: React.RefObject<HTMLDivElement | null>
}) {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [nextIndex, setNextIndex] = useState<number | null>(null)
	const [size, setSize] = useState({ w: 0, h: 0 })
	const [transitionProgress, setTransitionProgress] = useState(0)
	const [textures, setTextures] = useState<THREE.VideoTexture[]>([])
	const animationSpeed = 0.05

	const videosRef = useRef<HTMLVideoElement[]>([])

	// 1️⃣ створюємо відео + текстури і запускаємо всі відразу
	useEffect(() => {
		if (videos.length === 0) return

		const vids: HTMLVideoElement[] = []
		const texs: THREE.VideoTexture[] = []

		videos.forEach(src => {
			const video = document.createElement('video')
			video.src = src
			video.crossOrigin = 'anonymous'
			video.loop = true
			video.muted = true
			video.playsInline = true
			video.preload = 'auto'

			video.play().catch(() => {}) // стартуємо одразу

			const tex = new THREE.VideoTexture(video)
			tex.minFilter = THREE.LinearFilter
			tex.magFilter = THREE.LinearFilter
			tex.colorSpace = THREE.SRGBColorSpace

			vids.push(video)
			texs.push(tex)
		})

		videosRef.current = vids
		setTextures(texs)

		return () => texs.forEach(t => t.dispose())
	}, [videos])

	// 2️⃣ навігація по кліку
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (nextIndex !== null) return
			if (e.clientX < window.innerWidth / 2) {
				setNextIndex((currentIndex - 1 + videos.length) % videos.length)
			} else {
				setNextIndex((currentIndex + 1) % videos.length)
			}
		}

		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [currentIndex, nextIndex, videos.length])

	// 3️⃣ resize
	useEffect(() => {
		if (!containerRef.current) return
		const el = containerRef.current
		const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => ro.disconnect()
	}, [containerRef])

	// 4️⃣ анімація переходу
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

	// 5️⃣ курсор
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

type VIdeosProps = MediaItem[]
// 🔹 Компонент для підпису
function VideoCaption({ media }: { media: VIdeosProps }) {
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
				className={`text-sm text-center xl:text-left w-full tracking-3 leading-none ${playfairDisplay.className}`}
			>
				{media[index].name}
			</p>
		</div>
	)
}
