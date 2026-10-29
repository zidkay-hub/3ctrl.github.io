/**
 * The "Watch Demo Reel" popup. Set ONE of these:
 *  - `videoSrc`: a file in /public, e.g. '/videos/demo-reel.mp4' (drop the file at public/videos/demo-reel.mp4)
 *  - `embedUrl`: a YouTube/Vimeo embed URL, e.g. 'https://www.youtube.com/embed/VIDEO_ID'
 * If neither loads, the popup shows a "reel coming soon" message instead of a broken player.
 */
export const reel = {
	videoSrc: '/videos/demo-reel.mp4' as string | undefined,
	embedUrl: undefined as string | undefined,
	poster: undefined as string | undefined,
	title: '3CTRL demo reel',
};
