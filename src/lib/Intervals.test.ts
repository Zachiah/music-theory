import { describe, expect, it } from 'vitest';

import { Intervals } from './Intervals';
import { PitchClass } from './PitchClass';

describe('Intervals', () => {
	it('should properly rotate intervals', () => {
		expect(Intervals.rotate(Intervals.createWithSemitones(1, [2, 2, 1, 2, 2, 2]), 2)).toEqual(
			Intervals.createWithSemitones(1, [2, 1, 2, 2, 2, 1]),
		);

		expect(Intervals.rotate(Intervals.createWithSemitones(2, [4, 3]), 2)).toEqual<Intervals>([
			{ semitones: 3, letters: 2 },
			{ semitones: 5, letters: 3 },
		]);
	});

	it('should properly generate notes', () => {
		expect(
			Intervals.getPitches(Intervals.createWithSemitones(1, [1, 2, 3]), PitchClass.create('Ab')!),
		).toEqual(['Ab', 'Bbb', 'Cb', 'D'].map((n) => PitchClass.create(n)!));

		expect(
			Intervals.getPitches(Intervals.createWithSemitones(1, [1, 2, 3]), PitchClass.create('Abb')!),
		).toEqual(['Abb', 'Bbbb', 'Cbb', 'Db'].map((n) => PitchClass.create(n)!));

		expect(
			Intervals.getPitches(
				Intervals.createWithSemitones(1, [1, 2, 3, 4]),
				PitchClass.create('Ab')!,
			),
		).toEqual(['Ab', 'Bbb', 'Cb', 'D', 'E##'].map((n) => PitchClass.create(n)!));

		expect(
			Intervals.getPitches(
				Intervals.createWithSemitones(1, [1]),
				PitchClass.create('Abbbbbbbbbbbbbb')!,
			),
		).toEqual(['Abbbbbbbbbbbbbb', 'Bbbbbbbbbbbbbbbb'].map((n) => PitchClass.create(n)!));
	});

	it('should properly get triads', () => {
		expect(
			Intervals.getAllOfChordPattern(
				Intervals.createWithSemitones(1, [2, 2, 1, 2, 2, 2]),
				PitchClass.create('C')!,
				[0, 2, 4],
			),
		).toEqual(
			[
				['C', 'E', 'G'],
				['D', 'F', 'A'],
				['E', 'G', 'B'],
				['F', 'A', 'C'],
				['G', 'B', 'D'],
				['A', 'C', 'E'],
				['B', 'D', 'F'],
			].map((c) => c.map((n) => PitchClass.create(n))),
		);
	});
});
