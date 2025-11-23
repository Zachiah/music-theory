import { describe, it, expect } from 'vitest';

import {
	categorizeChordNotes,
	getModifiedOctave,
	scaleDegreeToPitchClass,
	type ScaleDegree
} from './categorizeChordNotes';
import type { CanonicalPitchClass } from './CanonicalPitchClass';
import { guessChord } from './guessChord';
import { PitchClass } from './PitchClass';

describe(categorizeChordNotes, () => {
	it('should categorize chord notes', () => {
		const t = (notes: CanonicalPitchClass[], degrees: ScaleDegree[]) => {
			const chord = guessChord(notes);

			expect(categorizeChordNotes(notes, chord)).toEqual(degrees);
		};

		t(['C', 'E', 'G'], ['1', '3', '5']);
		t(['D', 'Gb', 'A'], ['1', '3', '5']);
		t(['E', 'A', 'B'], ['1', '4', '5']);
		t(['D', 'Gb', 'A', 'Bb'], ['1', '3', '5', 'flat6']);
		t(['Gb', 'G', 'A', 'Bb'], ['7', '1', '2', 'flat3']);
		t(['Gb', 'G', 'Ab', 'A', 'Bb', 'B'], ['1', 'flat2', '2', 'sharp2', '3', '4']);
	});
});

describe(getModifiedOctave, () => {
	it('should work', () => {
		expect(
			getModifiedOctave(2, { letter: 'B', modifier: -1 }, { letter: 'A', modifier: 1 })
		).toEqual(2);
		expect(
			getModifiedOctave(2, { letter: 'C', modifier: -1 }, { letter: 'B', modifier: 0 })
		).toEqual(1);
	});
});

describe(scaleDegreeToPitchClass, () => {
	it('should work', () => {
		expect(scaleDegreeToPitchClass('4', { letter: 'G', modifier: -1 })).toEqual<PitchClass>({
			letter: 'C',
			modifier: -1
		});
	});
});
