import { describe, it, expect } from 'vitest';

import { Pitch } from './Pitch';

describe('Pitch', () => {
	it('Can parse pitches', () => {
		expect(Pitch.parse('C5')).toEqual<Pitch>({
			octave: 5,
			pitchClass: { letter: 'C', modifier: 0 }
		});
		expect(Pitch.parse('C#5')).toEqual<Pitch>({
			octave: 5,
			pitchClass: { letter: 'C', modifier: 1 }
		});
		expect(Pitch.parse('Bb8')).toEqual<Pitch>({
			octave: 8,
			pitchClass: { letter: 'B', modifier: -1 }
		});
		expect(Pitch.parse('Eb-4')).toEqual<Pitch>({
			octave: -4,
			pitchClass: { letter: 'E', modifier: -1 }
		});
		expect(Pitch.parse('P2')).toEqual(null);
		expect(Pitch.parse('asdlfkj')).toEqual(null);
	});
});
