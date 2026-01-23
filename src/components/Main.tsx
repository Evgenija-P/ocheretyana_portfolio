const MainComponent = ({ children }: { children: React.ReactNode }) => {
	return (
		<main
			className='relative flex items-center justify-center select-none w-full h-full touch-action-none Overflow-hidden'
			style={{ overscrollBehavior: 'none' }}
		>
			{children}
		</main>
	)
}
export default MainComponent
