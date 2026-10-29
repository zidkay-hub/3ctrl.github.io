import { gsap, lockScroll, prefersReducedMotion, unlockScroll } from './animations/core';

/** "Watch Demo Reel" popup: native <dialog>, media is only loaded the first time it opens. */
export function initReel() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-reel-dialog]');
	if (!dialog) return;

	const frame = dialog.querySelector<HTMLElement>('.reel-frame')!;
	const video = dialog.querySelector<HTMLVideoElement>('[data-reel-video]');
	const iframe = dialog.querySelector<HTMLIFrameElement>('iframe[data-src]');
	const fallback = dialog.querySelector<HTMLElement>('[data-reel-fallback]')!;
	let opener: HTMLElement | null = null;

	const showFallback = () => {
		fallback.hidden = false;
	};

	if (video) {
		// A missing file never fires `loadeddata`; it errors, and we swap in the friendly message.
		video.addEventListener('error', showFallback);
	}

	const load = () => {
		if (video && !video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
		if (iframe && !iframe.getAttribute('src') && iframe.dataset.src) iframe.src = iframe.dataset.src;
		if (!video?.dataset.src && !iframe?.dataset.src) showFallback();
	};

	const open = (trigger: HTMLElement) => {
		opener = trigger;
		load();
		lockScroll();
		dialog.showModal();

		if (!prefersReducedMotion()) {
			gsap.fromTo(frame, { scale: 0.92, y: 24, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
		}
		video?.play().catch(() => {
			/* autoplay can be blocked; the controls are right there */
		});
	};

	const close = () => {
		video?.pause();
		// Stop an embedded player by unloading it; it reloads on the next open.
		if (iframe) iframe.removeAttribute('src');
		dialog.close();
	};

	document.querySelectorAll<HTMLElement>('[data-reel-open]').forEach((btn) => btn.addEventListener('click', () => open(btn)));
	dialog.querySelector('[data-reel-close]')?.addEventListener('click', close);

	// Clicking the dimmed backdrop (outside the frame) closes it.
	dialog.addEventListener('click', (e) => {
		if (!frame.contains(e.target as Node)) close();
	});

	// Covers Esc, the close button and backdrop clicks alike.
	dialog.addEventListener('close', () => {
		video?.pause();
		if (iframe) iframe.removeAttribute('src');
		unlockScroll();
		opener?.focus();
	});
}
