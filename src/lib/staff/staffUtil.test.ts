import { describe, it, expect } from 'vitest';

import { getAlignment } from './staffUtil';
import { Pitch } from '$lib/Pitch';

describe(getAlignment, () => {
	const t = (notes: string[], expected: (number | [number])[]) => {
		const pitches = notes.map((n) => Pitch.parse(n)!);
		const alignments = getAlignment(pitches);

		expect(alignments.map((al) => (al.natural ? [al.alignment] : al.alignment))).toEqual(expected);
	};
	it('should handle basic situations properly', () => {
		t([], []);
		t(['C4'], [0]);
		t(['Cbbbb4'], [0]);
		t(['C4', 'E4', 'G4'], [0, 0, 0]);
		t(['C4', 'D4', 'E4', 'G4'], [0, 1, 0, 0]);
	});

	it('should give modifiers extra space', () => {
		t(['Cb4', 'Db4'], [0, 2]);
		t(['C#4', 'D#4'], [0, 2]);
	});

	it('should give notes on the same location extra space', () => {
		t(['C4', 'Db4', 'D4'], [1, 0, [3]]);
	});

	it("should take into account the previous line's notes if necessary", () => {
		t(['C4', 'Db4', 'D4', 'Eb4', 'E4'], [0, 2, [4], 0, [6]]);
	});

	it('should put accidentals first if possible', () => {
		t(['C3', 'D3', 'E3', 'F#3', 'G3', 'A3', 'B3'], [1, 0, 1, 0, 1, 0, 1]);
	});
});
