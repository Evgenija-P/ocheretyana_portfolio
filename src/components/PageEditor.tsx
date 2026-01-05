'use client'

import { db } from '@/services/firebase'

import { toast } from '../lib/toast'

import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

type MediaItem = {
	name: string
	type: string
	url: string
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
	const { register, control, handleSubmit, reset, watch } = useForm<PageFormValues>({
		defaultValues: {
			title: '',
			slug: '',
			seo_title: '',
			seo_description: '',
			description: '',
			isPublish: false,

			media: [
				{
					name: '',
					type: '',
					url: ''
				}
			]
		}
	})

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
			// перевіримо, чи користувач адмін

			if (id) {
				// update existing
				const ref = doc(db, 'pages', id)
				await updateDoc(ref, data)
				console.log('updated')
			} else {
				// create new
				await addDoc(collection(db, 'pages'), data)
				toast.success('Page created')
				toast.error('Page created error')

				toast.info('Page created info')
			}
		} catch (e) {
			console.error('firebase error', e)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<h2>Основна інформація</h2>

			<input placeholder='Title' {...register('title', { required: true })} />
			<input placeholder='Slug' {...register('slug', { required: true })} />
			<textarea placeholder='Description' {...register('description')} />

			<h2>SEO</h2>

			<input placeholder='SEO Title' {...register('seo_title')} />
			<textarea placeholder='SEO Description' {...register('seo_description')} />

			<label>
				<input type='checkbox' {...register('isPublish')} />
				Publish
			</label>

			<h2>Media</h2>

			{mediaFields.map((field, index) => (
				<div key={field.id}>
					<input placeholder='name' {...register(`media.${index}.name` as const)} />
					<input placeholder='type' {...register(`media.${index}.type` as const)} />
					<input placeholder='url' {...register(`media.${index}.url` as const)} />

					<button type='button' onClick={() => removeMedia(index)}>
						delete
					</button>
				</div>
			))}

			<button
				type='button'
				onClick={() =>
					addMedia({
						name: '',
						type: '',
						url: ''
					})
				}
			>
				+ media item
			</button>

			<button type='submit'>{id ? 'Update page' : 'Create page'}</button>
		</form>
	)
}

export default PageEditor
