'use client'

import { db } from '@/services/firebase'

import { toast } from '../lib/toast'

import { ContactsFormValues } from './ContactsComponent'

import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const ContactsEditor = () => {
	const { register, handleSubmit, reset } = useForm<ContactsFormValues>({
		defaultValues: {
			email: '',
			instagram: '',
			instaLink: ''
		}
	})

	// Підвантажуємо поточні контакти
	useEffect(() => {
		const loadContacts = async () => {
			const ref = doc(db, 'contacts', 'contacts') // твій документ
			const snap = await getDoc(ref)
			if (snap.exists()) {
				reset(snap.data() as ContactsFormValues)
			}
		}
		loadContacts()
	}, [reset])

	const onSubmit = async (data: ContactsFormValues) => {
		try {
			const ref = doc(db, 'contacts', 'contacts')
			await updateDoc(ref, {
				email: data.email,
				instagram: data.instagram,
				instaLink: data.instaLink
			})
			toast.success('Contacts updated')
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
			<h2 className='text-nav text-xl font-semibold'>Contacts</h2>

			<label className='font-semibold flex flex-col gap-y-3'>
				Email
				<input
					type='email'
					placeholder='Email'
					{...register('email', { required: true })}
					className='outline-none border-b border-b-nav focus:border-b-dark-purple transition-all duration-300 ease-in-out'
				/>
			</label>

			<label className='font-semibold flex flex-col gap-y-3'>
				Instagram
				<input
					placeholder='Instagram username'
					{...register('instagram', { required: true })}
					className='outline-none border-b border-b-nav focus:border-b-dark-purple transition-all duration-300 ease-in-out'
				/>
			</label>

			<label className='font-semibold flex flex-col gap-y-3'>
				Instagram link
				<input
					placeholder='Instagram link'
					{...register('instaLink')}
					className='outline-none border-b border-b-nav focus:border-b-dark-purple transition-all duration-300 ease-in-out'
				/>
			</label>

			<button type='submit' className='base-buttons w-60 h-10 mx-auto'>
				Update contacts
			</button>
		</form>
	)
}

export default ContactsEditor
