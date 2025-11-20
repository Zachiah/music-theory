import { describe, it, expect } from 'vitest';

import { PitchClass } from './PitchClass';

describe('PitchClass', () => {
	it('should convert from canonical pitches', () => {
		expect(PitchClass.fromCanonicalPitchClass('Ab')).toEqual({ letter: 'A', modifier: -1 });
	});
});
