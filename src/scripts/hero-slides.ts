import { gsap, prefersReducedMotion } from './animations/core';

const IMAGE_MS = 12000; // image-only reels hold for 12s
const MIN_VIDEO_MS = 10000;
const MAX_VIDEO_MS = 15000;
const FIRST_DELAY_MS = 4000; // let the page intro finish before the first reel change
const TRAVEL_S = 1.3; // flight time of the incoming screen; matches the slide-out transition in Hero.astro

type Box = { left: number; top: number; width: number; height: number };

/**
 * The phone plays a reel for 10-15s. Then the reel slides out to the left while the next
 * screen travels in from the collage on the right and lands on the phone.
 */
export function initHeroSlides() {
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	const stage = document.querySelector<HTMLElement>('[data-hero-stage]');
	const screen = document.querySelector<HTMLElement>('[data-hero-screen]');
	const wrap = document.querySelector<HTMLElement>('[data-hero-slides]');
	if (!hero || !stage || !screen || !wrap) return;

	const slides = Array.from(wrap.querySelectorAll<HTMLElement>('[data-slide]'));
	if (slides.length < 2 || prefersReducedMotion()) return;

	let index = 0;
	let timer: number | undefined;
	let visible = true;
	let flying = false;

	const videoOf = (slide: HTMLElement) => slide.querySelector<HTMLVideoElement>('video');

	const playVideo = (slide: HTMLElement) => {
		const video = videoOf(slide);
		if (!video) return;
		if (!video.getAttribute('src') && video.dataset.src) video.src = video.dataset.src;
		video.currentTime = 0;
		video.play().catch(() => {});
	};

	/** How long a reel stays: the clip length clamped to 10-15s, or 12s for an image. */
	const dwell = (slide: HTMLElement) => {
		const video = videoOf(slide);
		if (!video || !video.getAttribute('src') || video.error || !isFinite(video.duration)) return IMAGE_MS;
		return Math.min(MAX_VIDEO_MS, Math.max(MIN_VIDEO_MS, video.duration * 1000));
	};

	/** Box of `el` in the stage's coordinate space (includes any parallax offset it currently has). */
	const boxIn = (el: HTMLElement): Box => {
		const r = el.getBoundingClientRect();
		const o = stage.getBoundingClientRect();
		return { left: r.left - o.left, top: r.top - o.top, width: r.width, height: r.height };
	};

	const radiusOf = (el: HTMLElement) => parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;

	/** Where the incoming screen starts: its card in the collage, or just past the right edge if it has none. */
	const startBox = (id: string): { box: Box; radius: number } => {
		const source = document.querySelector<HTMLElement>(`[data-reel-source="${id}"]`);
		if (source) return { box: boxIn(source), radius: radiusOf(source) };
		const template = document.querySelector<HTMLElement>('[data-reel-source="c"]');
		const box = template ? boxIn(template) : { left: 0, top: 0, width: 200, height: 300 };
		return { box: { ...box, left: stage.clientWidth + 24 }, radius: template ? radiusOf(template) : 19 };
	};

	function next() {
		if (flying) return;
		flying = true;

		const current = slides[index];
		const target = slides[(index + 1) % slides.length];
		const { box: from, radius: fromRadius } = startBox(target.dataset.slide!);
		const to = boxIn(screen!);
		const toRadius = radiusOf(screen!);

		// A copy of the next screen that travels over the stage.
		const clone = document.createElement('div');
		const image = document.createElement('img');
		const targetImage = target.querySelector<HTMLImageElement>('img');
		image.src = targetImage?.currentSrc || targetImage?.src || '';
		image.alt = '';
		image.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;max-width:none;';
		clone.append(image);
		clone.setAttribute('aria-hidden', 'true');
		clone.style.cssText = `position:absolute;z-index:30;overflow:hidden;pointer-events:none;will-change:left,top,width,height;box-shadow:0 24px 57px rgba(15,23,42,.28);left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px;border-radius:${fromRadius}px;`;
		stage!.append(clone);

		// The current reel leaves to the left while the next screen flies in from the right.
		current.dataset.state = 'leaving';

		gsap.to(clone, {
			left: to.left,
			top: to.top,
			width: to.width,
			height: to.height,
			borderTopLeftRadius: toRadius,
			borderTopRightRadius: toRadius,
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
			duration: TRAVEL_S,
			ease: 'power3.inOut',
			onComplete: () => {
				// Hand over to the real slide inside the phone, without a visible jump.
				target.style.transition = 'none';
				target.dataset.state = 'active';
				current.style.transition = 'none';
				current.dataset.state = 'idle';
				void target.offsetWidth;
				target.style.transition = '';
				current.style.transition = '';
				clone.remove();

				videoOf(current)?.pause();
				playVideo(target);
				index = (index + 1) % slides.length;
				flying = false;
				schedule();
			},
		});
	}

	function schedule() {
		clearTimeout(timer);
		if (!visible || document.hidden || flying) return;
		timer = window.setTimeout(next, dwell(slides[index]));
	}

	new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible) schedule();
		else clearTimeout(timer);
	}, { threshold: 0.2 }).observe(hero);
	document.addEventListener('visibilitychange', () => (document.hidden ? clearTimeout(timer) : schedule()));

	timer = window.setTimeout(next, FIRST_DELAY_MS);
}
