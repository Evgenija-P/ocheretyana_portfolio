/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [new URL('https://res.cloudinary.com/**')]
	}
}

module.exports = nextConfig
