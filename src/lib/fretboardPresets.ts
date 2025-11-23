import type { Fretboard } from './Fretboard';
import { generateId } from './generateId';
import { Pitch } from './Pitch';

const guitarDots: Fretboard['dots'] = [
	{ fretNumber: 3, dots: 1 },
	{ fretNumber: 5, dots: 1 },
	{ fretNumber: 7, dots: 1 },
	{ fretNumber: 9, dots: 1 },
	{ fretNumber: 12, dots: 2 },
	{ fretNumber: 15, dots: 1 },
	{ fretNumber: 17, dots: 1 },
	{ fretNumber: 19, dots: 1 },
	{ fretNumber: 21, dots: 1 }
];

const ukeleleDots: Fretboard['dots'] = [
	{ fretNumber: 3, dots: 1 },
	{ fretNumber: 5, dots: 1 },
	{ fretNumber: 7, dots: 1 },
	{ fretNumber: 10, dots: 1 },
	{ fretNumber: 11, dots: 1 }
];

export const defaultPresets: Fretboard[] = [
	{
		name: 'Guitar',
		strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
		dots: guitarDots
	},
	{ name: 'Drop D Guitar', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E2'], dots: guitarDots },
	{ name: 'DADGAD Guitar', strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'], dots: guitarDots },
	{
		name: 'Ukelele (reentrant)',
		strings: ['G4', 'C4', 'E4', 'A4'],
		frets: 18,
		dots: ukeleleDots
	},
	{ name: 'Bass', strings: ['E1', 'A1', 'D2', 'G2'], dots: guitarDots },
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
