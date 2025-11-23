import type { Fretboard } from './Fretboard';
import { generateId } from './generateId';
import { Pitch } from './Pitch';

const guitarDots = [
	null,
	null,
	1,
	null,
	1,
	null,
	1,
	null,
	1,
	null,
	null,
	2,
	null,
	null,
	1,
	null,
	1,
	null,
	1,
	null,
	1
];

const ukeleleDots = [null, null, 1, null, 1, null, 1, null, null, 1, null, 1];

export const defaultPresets: Fretboard[] = [
	{
		name: 'Guitar',
		strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
		dots: guitarDots
	},
	{ name: 'Drop D Guitar', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E2'], dots: guitarDots },
	{ name: 'DADGAD', strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'], dots: guitarDots },
	{
		name: 'Ukelele (reentrant)',
		strings: ['G4', 'C4', 'E4', 'A4'],
		frets: 18,
		dots: ukeleleDots
	},
	{ name: 'Ukelele (low G)', strings: ['G3', 'C4', 'E4', 'A4'], frets: 18, dots: ukeleleDots }
].map((row) => ({
	id: generateId(),
	frets: 24,
	...row,
	strings: row.strings.map((s) => {
		const parsed = Pitch.parse(s);
		if (!parsed) {
			throw new Error('Failed to parse');
		}

		return Pitch.toCanonical(parsed);
	})
}));
