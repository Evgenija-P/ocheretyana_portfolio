'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const videos = [
	'/videos/video1.mp4',
	'/videos/video2.mp4',
	'/videos/video3.mp4',
	'/videos/video4.mp4'
]

export default function VideoGalleryCanvas() {
	const containerRef = useRef<HTMLDivElement>(null)

	return (
		<div className='fixed inset-0 flex items-center justify-center z-0 cursor-e-resize'>
			<div ref={containerRef} className='w-77.5 h-107.5 relative'>
				<Canvas orthographic camera={{ zoom: 1, position: [0, 0, 5] }}>
					<Gallery videos={videos} containerRef={containerRef} />
				</Canvas>
			</div>
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

	// const textures = useRef<THREE.VideoTexture[]>([])
	const videosRef = useRef<HTMLVideoElement[]>([])
	const autoplayStarted = useRef(false)

	// 1️⃣ створення відео + текстур (БЕЗ play)
	useEffect(() => {
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

			const tex = new THREE.VideoTexture(video)
			tex.minFilter = THREE.LinearFilter
			tex.magFilter = THREE.LinearFilter
			tex.colorSpace = THREE.SRGBColorSpace

			vids.push(video)
			texs.push(tex)
		})

		videosRef.current = vids
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTextures(texs)

		return () => {
			texs.forEach(t => t.dispose())
		}
	}, [videos])

	// 2️⃣ fake autoplay
	useEffect(() => {
		if (autoplayStarted.current) return

		const btn = document.createElement('button')
		btn.style.position = 'fixed'
		btn.style.opacity = '0'
		btn.style.pointerEvents = 'none'
		btn.style.width = '1px'
		btn.style.height = '1px'

		const start = () => {
			videosRef.current.forEach(video => {
				if (video && video.paused) {
					video.play().catch(() => {})
				}
			})
			autoplayStarted.current = true
		}

		btn.addEventListener('click', start)
		document.body.appendChild(btn)

		requestAnimationFrame(() => btn.click())

		return () => {
			btn.removeEventListener('click', start)
			document.body.removeChild(btn)
		}
	}, [])

	// 3️⃣ навігація по кліку
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (nextIndex !== null) return
			if (e.clientX < window.innerWidth / 2) {
				setNextIndex(Math.max(0, currentIndex - 1))
			} else {
				setNextIndex(Math.min(videos.length - 1, currentIndex + 1))
			}
		}
		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [currentIndex, nextIndex, videos.length])

	useEffect(() => {
		if (!containerRef.current) return

		const el = containerRef.current

		const update = () => {
			setSize({
				w: el.clientWidth,
				h: el.clientHeight
			})
		}

		update()

		const ro = new ResizeObserver(update)
		ro.observe(el)

		return () => ro.disconnect()
	}, [containerRef])

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
