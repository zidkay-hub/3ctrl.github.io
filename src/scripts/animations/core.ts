import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | undefined;

/** Smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
	if (lenis || prefersReducedMotion()) return;

	lenis = new Lenis({ autoRaf: false });
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((time) => lenis?.raf(time * 1000));
	gsap.ticker.lagSmoothing(0);

	// In-page anchors glide instead of jumping.
	document.addEventListener('click', (e) => {
		const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
		const hash = link?.getAttribute('href');
		if (!link || !hash || hash === '#') return;
		const target = document.querySelector<HTMLElement>(hash);
		if (!target) return;
		e.preventDefault();
		lenis?.scrollTo(target, { duration: 1.4 });
	});
}

/** Freeze page scrolling while a modal is open (Lenis intercepts the wheel, so it must stop too). */
export function lockScroll() {
	document.documentElement.classList.add('scroll-locked');
	lenis?.stop();
}

export function unlockScroll() {
	document.documentElement.classList.remove('scroll-locked');
	lenis?.start();
}

/** 1 at the 1440px design width, smaller below it (the page scales via the root font size). */
export const designScale = () =>
	parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;

export { gsap, ScrollTrigger };
