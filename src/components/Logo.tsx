import { playfairDisplay } from '@/app/(client)/layout'

import Link from 'next/link'

const Logo = () => {
	return (
		<Link
			className={`text-xl xl:text-2xl font-semibold text-nav uppercase ${playfairDisplay.className}`}
			href={'/'}
		>
			Ocheretyana
		</Link>
	)
}
export default Logo
