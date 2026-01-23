import BaseSection from './BaseSection'
import Logo from './Logo'
import NavBar from './NavBar'

const Header = () => {
	return (
		<header className='relative z-50'>
			<BaseSection className=''>
				<div className='w-full xl:w-fit flex flex-col flex-wrap xl:flex-nowrap xl:flex-row gap-5 items-center md:items-baseline xl:gap-15 pt-8 xl:pt-10 mx-auto'>
					<Logo />
					<NavBar />
				</div>
			</BaseSection>
		</header>
	)
}
export default Header
