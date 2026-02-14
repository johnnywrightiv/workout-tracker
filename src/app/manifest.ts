import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Workout Tracker',
		short_name: 'Workout Tracker',
		description: 'Improve your workouts with our tracker app!',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#0a0a0a',
		// Add icons to public/ (e.g. icon-192.png, icon-512.png) for home screen icon
		icons: [
			{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
			{ src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
		],
	};
}
