// Converts px values inside Tailwind arbitrary values (`[...]`) of .astro files to rem (16px base).
// Inline style strings, SVG data URIs and <style> blocks are left untouched.
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];

const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
		const p = path.join(dir, e.name);
		return e.isDirectory() ? walk(p) : p.endsWith('.astro') ? [p] : [];
	});

const conv = (s) =>
	s.replace(/(-?\d*\.?\d+)px(?![a-zA-Z])/g, (_, n) => {
		const v = parseFloat(n);
		if (v === 0) return '0';
		return `${+(v / 16).toFixed(5)}rem`;
	});

let changed = 0;
for (const f of walk(root)) {
	const src = fs.readFileSync(f, 'utf8');
	// Arbitrary values never contain spaces or quotes; limiting to [^\s\]"'`{}] keeps JS/HTML intact.
	const out = src.replace(/\[([^\s\]"'`{}]*px[^\s\]"'`{}]*)\]/g, (m, inner) => `[${conv(inner)}]`);
	if (out !== src) {
		fs.writeFileSync(f, out);
		changed++;
	}
}
console.log('files changed:', changed);
