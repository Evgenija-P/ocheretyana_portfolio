'use client'

import { db } from '@/services/firebase'

import { toast } from '../lib/toast'

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

export type MediaItem = {
	name: string
	type: string
	url: string
	order: number
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

const PageEditor = ({ id }: { id?: string }) => {
	const { register, control, handleSubmit, reset, watch, setValue } = useForm<PageFormValues>({
		defaultValues: {
			title: '',
			slug: '',
			seo_title: '',
			seo_description: '',
			description: '',
			isPublish: true,

			media: [
				{
					name: '',
					type: 'video',
					url: '',
					order: 0
				}
			]
		}
	})

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === 'title') {
				const title = value.title ?? '' // якщо undefined, беремо ''
				const slug = title
					.toLowerCase()
					.trim()
					.replace(/\s+/g, '-') // пробіли → дефіси
					.replace(/[^\w-]+/g, '') // прибрати все крім букв, цифр і дефісів
				setValue('slug', slug)
			}
		})
		return () => subscription.unsubscribe()
	}, [watch, setValue])

	const {
		fields: mediaFields,
		append: addMedia,
		remove: removeMedia
	} = useFieldArray<PageFormValues>({
		control,
		name: 'media'
	})

	// якщо редагування — підвантажимо значення
	useEffect(() => {
		if (!id) return

		async function load() {
			if (id) {
				const ref = doc(db, 'pages', id)
				const snap = await getDoc(ref)
				if (snap.exists()) reset(snap.data() as PageFormValues)
			}
		}

		load()
	}, [id, reset])
	const onSubmit = async (data: PageFormValues) => {
		try {
			if (id) {
				// update existing
				const ref = doc(db, 'pages', id)
				await updateDoc(ref, data)
				toast.success('Page updated')
				reset(data)
			} else {
				// create new
				await addDoc(collection(db, 'pages'), data)
				toast.success('Page created')
				reset()
			}
		} catch (e) {
			console.error('firebase error', e)
			toast.error('Something went wrong')
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
			<label className='font-semibold flex flex-col gap-y-3'>
				Slug (required field)
				<input
					placeholder='Slug'
					{...register('slug', { required: true })}
					className='outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
				/>
			</label>
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

			{mediaFields.map((field, index) => (
				<div key={field.id} className='mb-4 flex items-center justify-between'>
					<select
						{...register(`media.${index}.type` as const)}
						className='mb-1 w-1/4 outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
					>
						<option value='video'>Video</option>
						<option value='photo'>Photo</option>
					</select>
					{watch(`media.${index}.type`) === 'video' && (
						<input
							placeholder='Video URL'
							{...register(`media.${index}.url` as const)}
							className='w-1/4 outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
						/>
					)}
					{watch(`media.${index}.type`) === 'photo' && field.url && (
						<Image
							src={field.url}
							width={100}
							height={100}
							alt='preview'
							className='w-24 h-24 object-cover rounded'
						/>
					)}
					{watch(`media.${index}.type`) === 'photo' && (
						<input
							type='file'
							accept='image/*'
							onChange={async e => {
								const file = e.target.files?.[0]
								if (!file) return

								const formData = new FormData()
								formData.append('file', file)
								formData.append('upload_preset', 'unsigned_upload')

								const res = await fetch(
									`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
									{
										method: 'POST',
										body: formData
									}
								)
								const data = await res.json()
								console.log('Cloudinary response:', data)

								// замість reset використовуємо setValue
								setValue(`media.${index}.url`, data.secure_url)
							}}
							className='w-1/4 outline-none border-b border-b-nav active:border-b-dark-purple focus:border-b-dark-purple transition-all duration-300 ease-in-out focus:outline-none'
						/>
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
			))}

			<button
				type='button'
				onClick={() =>
					addMedia({
						type: 'video',
						url: '',
						name: '',
						order: mediaFields.length
					})
				}
				className='hover:text-nav transform duration-300 cursor-pointer'
			>
				+ media item
			</button>
			<button type='submit' className='base-buttons w-60 h-10 mx-auto'>
				{id ? 'Update page' : 'Create page'}
			</button>
		</form>
	)
}

export default PageEditor
