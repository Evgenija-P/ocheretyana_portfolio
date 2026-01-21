/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { Canvas, useFrame } from '@react-three/fiber'

import { playfairDisplay } from '../app/layout'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

export type MediaItem = {
	name: string
	type: 'photo' | 'video'
	url: string
	order: number
}

export default function VideoGalleryCanvas({ media }: { media: MediaItem[] }) {
	const containerRef = useRef<HTMLDivElement>(null)

	const items = useMemo(() => [...media].sort((a, b) => a.order - b.order), [media])

	const [current, setCurrent] = useState(0)
	const [next, setNext] = useState<number | null>(null)
	const [progress, setProgress] = useState(0)
	const [size, setSize] = useState({ w: 0, h: 0 })

	/* ---------- SIZE ---------- */
	useEffect(() => {
		if (!containerRef.current) return
		const el = containerRef.current
		const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => ro.disconnect()
	}, [])

	/* ---------- NAVIGATION ---------- */
	useEffect(() => {
		const onClick = (e: MouseEvent) => {
			if (next !== null) return

			const target =
				e.clientX < window.innerWidth / 2
					? (current - 1 + items.length) % items.length
					: (current + 1) % items.length

			setNext(target)
		}

		window.addEventListener('click', onClick)
		return () => window.removeEventListener('click', onClick)
	}, [current, next, items.length])

	/* ---------- CURSOR ---------- */
	useEffect(() => {
		const onMove = (e: MouseEvent) => {
			document.body.style.cursor =
				e.clientX < window.innerWidth / 2
					? 'url(/images/left.png) 16 16, auto'
					: 'url(/images/right.png) 16 16, auto'
		}
		window.addEventListener('mousemove', onMove)
		return () => {
			window.removeEventListener('mousemove', onMove)
			document.body.style.cursor = 'auto'
		}
	}, [])

	/* ---------- TRANSITION ---------- */
	useFrame(() => {
		if (next === null) return

		setProgress(p => {
			const n = p + 0.05
			if (n >= 1) {
				setCurrent(next)
				setNext(null)
				return 0
			}
			return n
		})
	})

	return (
		<div className='fixed inset-0 flex flex-col items-center justify-center'>
			<div ref={containerRef} className='relative w-77.5 h-107.5'>
				<Canvas
					orthographic
					camera={{ zoom: 1, position: [0, 0, 5] }}
					gl={{
						outputColorSpace: THREE.SRGBColorSpace,
						toneMapping: THREE.NoToneMapping
					}}
				>
					<GalleryScene
						items={items}
						current={current}
						next={next}
						progress={progress}
						width={size.w}
						height={size.h}
					/>
				</Canvas>
			</div>

			<div className='w-77.5 mt-7'>
				<p
					className={`min-h-3.5 text-sm text-center xl:text-left tracking-3 leading-none ${playfairDisplay.className}`}
				>
					{items[current]?.name || ' '}
				</p>
			</div>
		</div>
	)
}

/* ========================================================= */
/* ====================== SCENE ============================ */
/* ========================================================= */

function GalleryScene({
	items,
	current,
	next,
	progress,
	width,
	height
}: {
	items: MediaItem[]
	current: number
	next: number | null
	progress: number
	width: number
	height: number
}) {
	const [textures, setTextures] = useState<(THREE.Texture | null)[]>([])
	const videosRef = useRef<HTMLVideoElement[]>([])

	/* ---------- LOAD TEXTURES ---------- */
	useEffect(() => {
		const loader = new THREE.TextureLoader()
		const vids: HTMLVideoElement[] = []

		const loaded: (THREE.Texture | null)[] = items.map(item => {
			if (item.type === 'photo') {
				const tex = loader.load(item.url)
				tex.colorSpace = THREE.SRGBColorSpace
				return tex
			}

			const video = document.createElement('video')
			video.src = item.url
			video.crossOrigin = 'anonymous'
			video.loop = true
			video.muted = true
			video.playsInline = true
			video.preload = 'auto'
			video.play().catch(() => {})

			vids.push(video)
			return new THREE.VideoTexture(video)
		})

		videosRef.current = vids
		setTextures(loaded)

		return () => {
			loaded.forEach(tex => tex?.dispose())
			vids.forEach(v => {
				v.pause()
				v.src = ''
				v.load()
			})
		}
	}, [items])

	if (width === 0 || height === 0) return null

	return (
		<>
			{textures[current] && (
				<Slide
					texture={textures[current]!}
					opacity={next !== null ? 1 - progress : 1}
					width={width}
					height={height}
				/>
			)}

			{next !== null && textures[next] && (
				<Slide texture={textures[next]!} opacity={progress} width={width} height={height} />
			)}
		</>
	)
}

/* ========================================================= */
/* ====================== SLIDE ============================ */
/* ========================================================= */

function Slide({
	texture,
	opacity,
	width,
	height
}: {
	texture: THREE.Texture
	opacity: number
	width: number
	height: number
}) {
	return (
		<mesh>
			<planeGeometry args={[width, height]} />
			<meshBasicMaterial map={texture} transparent opacity={opacity} toneMapped={false} />
		</mesh>
	)
}
