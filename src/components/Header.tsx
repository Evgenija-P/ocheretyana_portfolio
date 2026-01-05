import BaseSection from './BaseSection'
import Logo from './Logo'
import NavBar from './NavBar'

const Header = () => {
	return (
		<header className=''>
			<BaseSection className='flex flex-col xl:flex-row gap-5 xl:gap-30 items-center pt-14.5 mb-27.5'>
				<Logo />
				<NavBar />
			</BaseSection>
		</header>
	)
}
export default Header
