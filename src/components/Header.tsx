import Logo from './Logo'
import NavBar from './NavBar'

const Header = () => {
	return (
		<header className='relative z-50 px-4'>
			<div className='w-full md:w-fit flex flex-col flex-wrap md:flex-nowrap md:flex-row gap-5 items-center xl:items-baseline xl:gap-15 pt-8 lg:pt-10 mx-auto'>
				<Logo />
				<NavBar />
			</div>
		</header>
	)
}
export default Header
