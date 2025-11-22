import { describe, it, expect } from 'vitest';

import { CanonicalPitch as CP, CanonicalPitchArray as CPA } from './CanonicalPitch';
import { Pitch } from './Pitch';

describe('CP', () => {
	const n = (s: string) => Pitch.toCanonical(Pitch.parse(s)!);

	it('Can increment pitches', () => {
		expect(CP.applyOffset(n('B3'), 1)).toEqual<CP>(n('C4'));
		expect(CP.applyOffset(n('Ab3'), 1)).toEqual<CP>(n('A3'));
		expect(CP.applyOffset(n('D3'), 17)).toEqual<CP>(n('G4'));
		expect(CP.applyOffset(n('C3'), -1)).toEqual<CP>(n('B2'));
	});

	it('Can sort pitches', () => {
		expect(CPA.sort([n('A4'), n('D2'), n('B2'), n('C2'), n('B1')])).toEqual([
			n('B1'),
			n('C2'),
			n('D2'),
			n('B2'),
			n('A4')
		]);
	});
});
