import { describe, it, expect } from 'vitest';

import { CanonicalPitch as CP } from './CanonicalPitch';

describe('CP', () => {
	it('Can parse pitches', () => {
		expect(CP.parse('C5')).toEqual<CP>({ octave: 5, pitchClass: 'C' });
		expect(CP.parse('Bb8')).toEqual<CP>({ octave: 8, pitchClass: 'Bb' });
		expect(CP.parse('P2')).toEqual(null);
		expect(CP.parse('asdlfkj')).toEqual(null);
	});

	const n = (s: string) => {
		const note = CP.parse(s);

		if (!note) {
			throw new Error('failed to parse note');
		}

		return note;
	};

	it('Can increment pitches', () => {
		expect(CP.applyOffset(n('B3'), 1)).toEqual<CP>(n('C4'));
		expect(CP.applyOffset(n('Ab3'), 1)).toEqual<CP>(n('A3'));
		expect(CP.applyOffset(n('D3'), 17)).toEqual<CP>(n('G4'));
		expect(CP.applyOffset(n('C3'), -1)).toEqual<CP>(n('B2'));
	});

	it('Can sort pitches', () => {
		expect(CP.sort([n('A4'), n('D2'), n('B2'), n('C2'), n('B1')])).toEqual([
			n('B1'),
			n('C2'),
			n('D2'),
			n('B2'),
			n('A4')
		]);
	});
});
