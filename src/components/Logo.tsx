import { playfairDisplay } from '@/src/app/(client)/layout'

import Link from 'next/link'

const Logo = () => {
	return (
		<Link
			className={`text-xl font-semibold text-nav leading-none! uppercase tracking-[-0.05em]! ${playfairDisplay.className}`}
			href={'/'}
		>
			Ocheretyana
		</Link>
	)
}
export default Logo
