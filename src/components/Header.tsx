import BaseSection from './BaseSection'
import Logo from './Logo'
import NavBar from './NavBar'

const Header = () => {
	return (
		<header className='relative z-50'>
			<BaseSection className='flex flex-col xl:flex-row gap-5 xl:gap-30 items-center pt-8 xl:pt-14.5'>
				<div className='w-1/5 flex items-center justify-center xl:justify-normal'>
					<Logo />
				</div>
				<NavBar />
				<div className='hidden xl:flex w-1/5' />
			</BaseSection>
		</header>
	)
}
export default Header
