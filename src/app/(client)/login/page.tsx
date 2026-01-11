import { LoginForm } from '@/src/components/LoginForm'

import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Login by admin panel'
}
const Login = () => {
	return (
		<main className='w-full max-w-screen h-full max-h-screen flex flex-col gap-y-10'>
			<section className='w-full px-10 xl:px-14 flex flex-col xl:flex-row gap-5 xl:gap-30 items-center mx-auto pb-20'>
				<LoginForm />
			</section>
		</main>
	)
}
export default Login
