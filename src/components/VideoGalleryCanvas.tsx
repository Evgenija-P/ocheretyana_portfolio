'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const videos = ['/videos/video1.mp4', '/videos/video2.mp4', '/videos/video3.mp4']

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
	const [transitionProgress, setTransitionProgress] = useState(0)
	const animationSpeed = 0.05

	const textures = useRef<THREE.VideoTexture[]>([])

	useEffect(() => {
		videos.forEach((src, i) => {
			const video = document.createElement('video')
			video.src = src
			video.crossOrigin = 'anonymous'
			video.loop = true
			video.muted = true
			video.playsInline = true
			video.autoplay = true
			video.play().catch(() => {})
			const tex = new THREE.VideoTexture(video)
			tex.minFilter = THREE.LinearFilter
			tex.magFilter = THREE.LinearFilter
			tex.colorSpace = THREE.SRGBColorSpace
			textures.current[i] = tex
		})
	}, [videos])

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentIndex, nextIndex])

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

	// розрахунок геометрії під контейнер
	let planeW = 0
	let planeH = 0
	if (containerRef.current) {
		const { clientWidth, clientHeight } = containerRef.current
		// orthographic камера з zoom=1 → 1 unit = 1px
		planeW = clientWidth
		planeH = clientHeight
	}

	return (
		<>
			{textures.current[currentIndex] && (
				<mesh>
					<planeGeometry args={[planeW, planeH]} />
					<meshBasicMaterial
						map={textures.current[currentIndex]}
						opacity={nextIndex !== null ? 1 - transitionProgress : 1}
						transparent
					/>
				</mesh>
			)}

			{nextIndex !== null && textures.current[nextIndex] && (
				<mesh>
					<planeGeometry args={[planeW, planeH]} />
					<meshBasicMaterial
						map={textures.current[nextIndex]}
						opacity={transitionProgress}
						transparent
					/>
				</mesh>
			)}
		</>
	)
}
