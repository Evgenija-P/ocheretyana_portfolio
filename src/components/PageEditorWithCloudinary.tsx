'use client'

import { db } from '@/services/firebase'

import { toast } from '../lib/toast'

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export type MediaItem = {
	name: string
	type: string
	url: string | File
}

export type PageFormValues = {
	title: string
	slug: string
	seo_title: string
	seo_description: string
	description: string
	isPublish: boolean
	media: MediaItem[]
}

const PageEditorWithCloudinary = ({ id }: { id?: string }) => {
	const {
		register,
		control,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { defaultValues }
	} = useForm<PageFormValues>({
		defaultValues: {
			title: '',
			slug: '',
			seo_title: '',
			seo_description: '',
			description: '',
			isPublish: true,
			media: [{ name: '', type: 'video', url: '' }]
		}
	})

	const [replaceMode, setReplaceMode] = useState<Record<number, boolean>>({})
	const [isUploading, setIsUploading] = useState(false)
	const fileRefs = useRef<(HTMLInputElement | null)[]>([])
	// slug автогенерація
	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === 'title') {
				const title = value.title ?? ''
				const slug = title
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-')
					.replace(/[^\w-]+/g, '')
				setValue('slug', slug)
			}
		})
		return () => subscription.unsubscribe()
	}, [watch, setValue])

	const {
		fields: mediaFields,
		append: addMedia,
		remove: removeMedia
	} = useFieldArray({
		control,
		name: 'media'
	})

	// Завантаження для редагування
	useEffect(() => {
		if (!id) return
		async function load() {
			const ref = doc(db, 'pages', id as string)
			const snap = await getDoc(ref)
			if (snap.exists()) {
				const data = snap.data() as PageFormValues
				reset(data)
				const initialReplace: Record<number, boolean> = {}
				data.media.forEach((_, idx) => (initialReplace[idx] = false))
				setReplaceMode(initialReplace)
			}
		}
		load()
	}, [id, reset])

	// Cloudinary upload
	const uploadToCloudinary = async (file: File) => {
		const formData = new FormData()
		formData.append('file', file)
		formData.append('upload_preset', 'unsigned_upload')

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
			{ method: 'POST', body: formData }
		)
		const data = await res.json()
		return data.secure_url as string
	}

	const onSubmit = async (data: PageFormValues) => {
		try {
			setIsUploading(true)

			const preparedMedia = await Promise.all(
				data.media.map(async m => {
					if (m.url instanceof File) {
						const uploadedUrl = await uploadToCloudinary(m.url)
						return { ...m, url: uploadedUrl }
					}
					return m
				})
			)

			const preparedData: PageFormValues = {
				...data,
				media: preparedMedia
			}

			if (id) {
				await updateDoc(doc(db, 'pages', id), preparedData)
				toast.success('Page updated')
			} else {
				await addDoc(collection(db, 'pages'), preparedData)
				toast.success('Page created')
			}

			reset(preparedData)
		} catch (e) {
			console.error('submit error', e)
			toast.error('Something went wrong')
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='w-4/5 mx-auto rounded-xl border border-slate-400 shadow-2xl px-10 py-6 flex flex-col gap-4'
		>
			<h2 className='text-nav text-xl font-semibold'>Base info</h2>

			<label className='font-semibold flex flex-col gap-y-3'>
				Page title (required field)
				<input
					placeholder='Title'
					{...register('title', { required: true })}
					className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
				/>
			</label>

			{defaultValues && defaultValues.slug !== 'home' && (
				<label className='font-semibold flex flex-col gap-y-3'>
					Slug (required field)
					<input
						placeholder='Slug'
						{...register('slug', { required: true })}
						className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
					/>
				</label>
			)}

			<label className='font-semibold flex flex-col gap-y-3'>
				Description
				<textarea
					placeholder='Description'
					{...register('description')}
					className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
				/>
			</label>

			<label className='font-semibold flex gap-3'>
				<input type='checkbox' {...register('isPublish')} />
				Publish
			</label>

			<h2 className='text-nav text-xl font-semibold'>Media</h2>

			{mediaFields.map((field, index) => {
				const isUploaded = typeof field.url === 'string' && field.url.length > 0

				return (
					<div key={field.id} className='mb-4 flex items-center justify-between gap-3'>
						<select
							{...register(`media.${index}.type` as const)}
							className='mb-1 w-1/4 outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
						>
							<option value='video'>Video</option>
							<option value='photo'>Photo</option>
						</select>

						{watch(`media.${index}.type`) === 'video' && (
							<div className='flex flex-col gap-1 w-1/4'>
								{isUploaded && !replaceMode[index] ? (
									<div className='flex items-center justify-center gap-4'>
										<span className='text-sm text-green-600'>File</span>
										<button
											type='button'
											className='text-sm text-blue-500 hover:underline'
											onClick={() => {
												setReplaceMode(prev => ({ ...prev, [index]: true }))
												setTimeout(() => {
													fileRefs.current[index]?.click()
												}, 0)
											}}
										>
											Update
										</button>
									</div>
								) : (
									<input
										type='file'
										accept='video/*'
										ref={el => {
											fileRefs.current[index] = el
										}}
										onChange={e => {
											const file = e.target.files?.[0]
											if (!file) return
											setValue(`media.${index}.url`, file)
										}}
										className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
									/>
								)}
							</div>
						)}

						{watch(`media.${index}.type`) === 'photo' && (
							<div className='flex flex-col gap-1 w-1/4'>
								{isUploaded && !replaceMode[index] ? (
									<div className='flex items-center justify-center gap-4'>
										<Image
											src={field.url as string}
											width={100}
											height={100}
											alt='preview'
											className='w-24 h-24 object-cover rounded'
										/>
										<button
											type='button'
											className='text-sm text-blue-500 hover:underline'
											onClick={() =>
												setReplaceMode(prev => ({ ...prev, [index]: true }))
											}
										>
											Update
										</button>
									</div>
								) : (
									<input
										type='file'
										accept='image/*'
										onChange={e => {
											const file = e.target.files?.[0]
											if (!file) return
											setValue(`media.${index}.url`, file)
										}}
										className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
									/>
								)}
							</div>
						)}

						<input
							placeholder='description'
							{...register(`media.${index}.name` as const)}
							className='mb-1 w-1/4 outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
						/>

						<button
							type='button'
							onClick={() => removeMedia(index)}
							className='hover:text-nav transform duration-300 cursor-pointer'
						>
							Delete
						</button>
					</div>
				)
			})}

			<button
				type='button'
				onClick={() =>
					addMedia({
						type: 'video',
						url: '',
						name: ''
					})
				}
				className='hover:text-nav transform duration-300 cursor-pointer'
			>
				+ media item
			</button>

			<button type='submit' className='base-buttons w-60 h-10 mx-auto' disabled={isUploading}>
				{isUploading ? 'Uploading...' : id ? 'Update page' : 'Create page'}
			</button>
		</form>
	)
}

export default PageEditorWithCloudinary
