/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['res.cloudinary.com'] // <== додали Cloudinary
	}
}

module.exports = nextConfig
