import { gsap, ScrollTrigger, designScale, prefersReducedMotion } from './core';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
	root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
	Array.from(root.querySelectorAll<T>(sel));

const EASE = 'power3.out';

/** Fade-and-rise a group when it scrolls into view. */
function reveal(targets: Element[] | NodeListOf<Element>, trigger: Element, vars: gsap.TweenVars = {}) {
	if (!targets.length) return;
	gsap.fromTo(
		targets,
		{ y: 50, opacity: 0 },
		{
			y: 0,
			opacity: 1,
			duration: 0.9,
			ease: EASE,
			stagger: 0.1,
			scrollTrigger: { trigger, start: 'top 82%', once: true },
			...vars,
		}
	);
}

/** Wraps each word in an inline-block span so words can animate individually. */
function splitWords(el: HTMLElement) {
	const text = el.textContent ?? '';
	el.setAttribute('aria-label', text);
	el.textContent = '';
	return text
		.trim()
		.split(/\s+/)
		.map((word, i, all) => {
			const span = document.createElement('span');
			span.textContent = word;
			span.style.display = 'inline-block';
			span.setAttribute('aria-hidden', 'true');
			el.append(span);
			if (i < all.length - 1) el.append(' ');
			return span;
		});
}

/** Hero intro plays on load, the rest of the page is driven by scroll. */
function hero() {
	const root = $('[data-hero]');
	if (!root) return;

	const cards = Array.from($('[data-hero-cards]', root)!.children) as HTMLElement[];
	const phone = $('[data-hero-phone]', root)!;
	const side = cards.filter((c) => c !== phone);

	const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
	tl.fromTo('[data-site-header]', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
		.fromTo('[data-hero-line]', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.14 }, '-=0.4')
		.fromTo('[data-hero-sub]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
		.fromTo('[data-hero-cta]', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
		.fromTo(phone, { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.5')
		.fromTo(
			side,
			{ y: 180, opacity: 0 },
			{ y: 0, opacity: 1, duration: 1.1, stagger: { each: 0.09, from: 'center' } },
			'-=0.9'
		)
		.fromTo('[data-hero-fill]', { y: 180, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, '-=0.7')
		.fromTo('[data-hero-stat]', { scale: 0.6, opacity: 0, transformOrigin: '0% 100%' }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)' }, '-=0.4');
}

function contentEngine() {
	const root = $('[data-engine]');
	if (!root) return;
	const copy = $('[data-engine-copy]', root)!;

	reveal(Array.from(copy.children).filter((c) => c.tagName !== 'OL'), copy);
	reveal($$('li', copy), $('ol', copy)!, { stagger: 0.12 });

	const panels = $$('[data-panel]', root);
	gsap.fromTo(
		panels,
		{ clipPath: 'inset(100% 0% 0% 0% round 1.6rem)' },
		{
			clipPath: 'inset(0% 0% 0% 0% round 1.6rem)',
			duration: 1.2,
			ease: 'power4.inOut',
			stagger: 0.15,
			scrollTrigger: { trigger: $('[data-engine-panels]', root)!, start: 'top 80%', once: true },
		}
	);
	panels.forEach((panel) => {
		const img = $('img', panel);
		if (!img) return;
		gsap.fromTo(
			img,
			{ scale: 1.25, yPercent: -6 },
			{
				scale: 1,
				yPercent: 6,
				ease: 'none',
				scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
			}
		);
	});
}

function translationGap() {
	const root = $('[data-gap]');
	if (!root) return;
	const art = $('[data-gap-art]', root)!;
	const copy = $('[data-gap-copy]', root)!;

	gsap.fromTo(
		art.firstElementChild,
		{ scale: 0.88, opacity: 0, transformOrigin: '0% 100%' },
		{ scale: 1, opacity: 1, duration: 1.1, ease: EASE, scrollTrigger: { trigger: art, start: 'top 75%', once: true } }
	);
	gsap.fromTo(
		art.lastElementChild,
		{ y: 90, opacity: 0 },
		{ y: 0, opacity: 1, duration: 1.1, ease: EASE, delay: 0.15, scrollTrigger: { trigger: art, start: 'top 70%', once: true } }
	);
	const inbox = art.children[2];
	if (inbox) {
		gsap.fromTo(
			inbox,
			{ x: -70, opacity: 0 },
			{ x: 0, opacity: 1, duration: 1, ease: EASE, delay: 0.3, scrollTrigger: { trigger: art, start: 'top 70%', once: true } }
		);
	}

	reveal(Array.from(copy.children).filter((c) => c.tagName !== 'UL'), copy);
	reveal($$('li', copy), $('ul', copy)!, { stagger: 0.12 });
}

function services() {
	const root = $('[data-services]');
	if (!root) return;
	const head = $('.relative > .flex.items-end', root);
	if (head) reveal(Array.from(head.querySelectorAll('span, h2, p')), head);

	const cards = $$('[data-service-card]', root);
	gsap.fromTo(
		cards,
		{ y: 110, opacity: 0, rotate: 2 },
		{
			y: 0,
			opacity: 1,
			rotate: 0,
			duration: 1,
			ease: EASE,
			stagger: 0.12,
			scrollTrigger: { trigger: cards[0], start: 'top 85%', once: true },
		}
	);
	$$('[data-service-card] img[class*="rotate"]', root).forEach((mark) =>
		gsap.to(mark, {
			rotate: '+=24',
			ease: 'none',
			scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom top', scrub: true },
		})
	);
}

function growthLab() {
	const root = $('[data-growth-lab]');
	if (!root) return;

	reveal($$('[data-growth-head] > *', root), $('[data-growth-head]', root)!, {
		scrollTrigger: { trigger: root, start: 'top 70%', once: true },
	});

	// The cards start hidden behind the phone's screen and pop out to their places as you scroll.
	const phone = $('[data-growth-phone]', root)!;
	const stage = phone.parentElement as HTMLElement;
	const cards = $$('[data-growth-card]', root);

	// Offsets are layout-based (offsetLeft/Top), so they stay correct at any viewport width.
	const phoneCenter = () => ({
		x: phone.offsetLeft + phone.offsetWidth / 2,
		y: phone.offsetTop + phone.offsetHeight * 0.4,
	});
	const offsetToPhone = (card: HTMLElement, axis: 'x' | 'y') =>
		phoneCenter()[axis] - (axis === 'x' ? card.offsetLeft + card.offsetWidth / 2 : card.offsetTop + card.offsetHeight / 2);

	gsap.set(phone, { zIndex: 2 });
	gsap.set(cards, { zIndex: 1 });

	const tl = gsap.timeline({
		defaults: { ease: 'none' },
		scrollTrigger: { trigger: stage, start: 'top 88%', end: 'top 14%', scrub: 1, invalidateOnRefresh: true },
	});

	tl.fromTo($('img', phone), { y: 140, scale: 0.9 }, { y: 0, scale: 1, ease: 'power2.out', duration: 0.4 }, 0);

	cards.forEach((card, i) => {
		const onLeft = card.offsetLeft + card.offsetWidth / 2 < phoneCenter().x;
		tl.fromTo(
			card,
			{
				x: () => offsetToPhone(card, 'x'),
				y: () => offsetToPhone(card, 'y'),
				scale: 0.2,
				rotate: onLeft ? -16 : 16,
				opacity: 0,
			},
			{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.35)', duration: 0.45 },
			0.2 + i * 0.13
		);
	});

	// Once they've landed, the cards sit above the phone like in the design.
	tl.set(cards, { zIndex: 3 }, 0.9);
}

function globalReach() {
	const root = $('[data-reach]');
	if (!root) return;
	const map = $('[data-reach-map]', root)!;

	gsap.fromTo(
		$('img', map),
		{ scale: 1.15, opacity: 0 },
		{ scale: 1, opacity: 1, duration: 1.4, ease: EASE, scrollTrigger: { trigger: map, start: 'top 80%', once: true } }
	);
	gsap.fromTo(
		$$('[data-pin]', map),
		{ scale: 0, y: -40, opacity: 0, transformOrigin: '50% 100%' },
		{
			scale: 1,
			y: 0,
			opacity: 1,
			duration: 0.9,
			ease: 'back.out(1.8)',
			stagger: 0.14,
			scrollTrigger: { trigger: map, start: 'top 65%', once: true },
		}
	);

	const copy = $('[data-reach-copy]', root)!;
	reveal(Array.from(copy.children), copy);

	$$('[data-count]', copy).forEach((el) => {
		const match = el.textContent?.trim().match(/^(\d+)(\+?)$/);
		if (!match) return;
		const [, num, suffix] = match;
		const counter = { v: 0 };
		gsap.to(counter, {
			v: Number(num),
			duration: 1.8,
			ease: 'power2.out',
			onUpdate: () => (el.textContent = `${Math.round(counter.v)}${suffix}`),
			scrollTrigger: { trigger: el, start: 'top 90%', once: true },
		});
		el.textContent = `0${suffix}`;
	});
}

function clientQuote() {
	const root = $('[data-quote]');
	if (!root) return;

	const quote = $('blockquote', root)!;
	const words = splitWords(quote);
	gsap.fromTo(
		words,
		{ opacity: 0.18, y: 8 },
		{
			opacity: 1,
			y: 0,
			ease: 'none',
			stagger: 0.08,
			scrollTrigger: { trigger: root, start: 'top 70%', end: 'center 35%', scrub: 0.6 },
		}
	);

	const copy = $('[data-quote-copy]', root)!;
	reveal([copy.firstElementChild!, copy.lastElementChild!], copy);
	gsap.fromTo(
		$('[data-quote-photo]', root),
		{ scale: 0.92, opacity: 0 },
		{ scale: 1, opacity: 1, duration: 1.2, ease: EASE, transformOrigin: '50% 100%', scrollTrigger: { trigger: root, start: 'top 70%', once: true } }
	);
}

function testimonials() {
	const root = $('[data-testimonials]');
	if (!root) return;
	reveal($$('[data-reveal] > *', root), $('[data-reveal]', root)!);

	// Cards keep their slot opacity from CSS; only the transform is animated, then released.
	gsap.fromTo(
		$$('[data-t-card]', root),
		{ y: 110 },
		{
			y: 0,
			duration: 1.1,
			ease: EASE,
			stagger: 0.1,
			clearProps: 'transform',
			scrollTrigger: { trigger: $('[data-t-stage]', root)!, start: 'top 80%', once: true },
		}
	);
}

function faq() {
	const root = $('[data-faq]');
	if (!root) return;
	const left = $('[data-reveal]', root)!;
	reveal(Array.from(left.children), left);

	const items = $$('[data-faq-item]', root);
	gsap.fromTo(
		items,
		{ x: 60, opacity: 0 },
		{ x: 0, opacity: 1, duration: 0.9, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: items[0], start: 'top 85%', once: true } }
	);
}

function contactCta() {
	const root = $('[data-cta]');
	if (!root) return;
	const copy = $('[data-cta-copy]', root)!;

	reveal(Array.from(copy.firstElementChild!.children), copy);
	reveal($$('li', copy), $('ul', copy)!, { stagger: 0.12 });
	gsap.fromTo(
		$('[data-cta-form]', root),
		{ y: 90, opacity: 0, scale: 0.96 },
		{ y: 0, opacity: 1, scale: 1, duration: 1.1, ease: EASE, scrollTrigger: { trigger: root, start: 'top 60%', once: true } }
	);
}

function footer() {
	const root = $('[data-footer]');
	if (!root) return;
	reveal(Array.from(root.children), root, { scrollTrigger: { trigger: root, start: 'top 90%', once: true } });
}

/**
 * Parallax depth: any element with data-depth drifts relative to its section.
 * Positive depth moves with the scroll direction faster (lags then catches up),
 * negative depth drifts the other way. Uses the individual `translate` property so
 * it never fights with the GSAP entrance transforms.
 */
function parallax() {
	const k = designScale();
	const RANGE = 120 * k;
	const inHero = (el: Element) => !!el.closest('[data-hero]');

	$$('[data-depth]').forEach((el) => {
		const depth = Number(el.dataset.depth);
		if (!depth) return;
		const section = el.closest('section') ?? el;
		const hero = inHero(el);
		el.style.willChange = 'translate';

		ScrollTrigger.create({
			trigger: section,
			start: hero ? 'top top' : 'top bottom',
			end: 'bottom top',
			onUpdate: ({ progress }) => {
				// Hero: sink slower than the page (cards stay anchored to the bottom edge).
				// Elsewhere: swing from +RANGE to -RANGE around the middle of the section's pass.
				const y = hero ? depth * RANGE * 1.2 * progress : depth * RANGE * (1 - progress * 2);
				el.style.translate = `0 ${y.toFixed(1)}px`;
			},
		});
	});
}

export function initHome() {
	if (prefersReducedMotion()) return;

	hero();
	contentEngine();
	translationGap();
	services();
	growthLab();
	globalReach();
	clientQuote();
	testimonials();
	faq();
	contactCta();
	footer();
	parallax();

	// Images and fonts shift layout after first paint; recompute trigger positions once settled.
	window.addEventListener('load', () => ScrollTrigger.refresh());
	document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
