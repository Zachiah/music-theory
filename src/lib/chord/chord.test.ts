import { describe, it, expect } from 'vitest';
import { Chord } from './chord';
import type { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import { PitchClass } from '$lib/PitchClass';
import type { ScaleDegree } from './scaleDegree';

describe(Chord, () => {
	const t = (root: string, notes: CanonicalPitchClass[], result: ScaleDegree[]) => {
		const n = PitchClass.create(root)!;
		expect(Chord.guessFromPitchesWithRoot(n, notes)).toEqual(new Chord(n, result));
	};

	const t2 = (root: string, notes: CanonicalPitchClass[], result: ScaleDegree[]) => {
		const n = PitchClass.create(root)!;
		expect(Chord.guessFromPitches(notes)).toEqual(new Chord(n, result));
	};

	it('Should guess chords with a root provided', () => {
		t('C', ['C', 'E', 'G'], ['1', '3', '5']);
		t('Ab', ['C', 'E', 'G', 'Ab'], ['3', 'sharp5', '7', '1']);
		t('E', ['Bb'], ['flat5']);
		t('C', ['C', 'E', 'G', 'Bb', 'D', 'Gb'], ['1', '3', '5', 'flat7', '2', 'sharp4']);
		t('C', ['C', 'Eb', 'Gb', 'A'], ['1', 'flat3', 'flat5', 'flatflat7']);
		t('C', ['C', 'Eb', 'Gb', 'A', 'G'], ['1', 'flat3', 'sharp4', '6', '5']);
		t('C', ['C', 'Eb', 'E', 'G'], ['1', 'sharp2', '3', '5']);
		t('C', ['C', 'D', 'Eb', 'E', 'G'], ['1', '2', 'flat3', '3', '5']);
		t('C', ['C', 'D', 'Eb', 'E', 'G', 'Bb'], ['1', '2', 'sharp2', '3', '5', 'flat7']);
		t('C', ['C', 'E', 'Gb', 'Ab'], ['1', '3', 'sharp4', 'sharp5']);
	});

	it('Should guess chords with no root provided', () => {
		t2('C', ['C', 'E', 'G'], ['1', '3', '5']);
		t2('C', ['E', 'G', 'C'], ['3', '5', '1']);
		t2('C', ['Eb', 'G', 'C'], ['flat3', '5', '1']);
		t2('D', ['Db', 'D', 'Gb', 'A'], ['7', '1', '3', '5']);
		t2('C', ['E', 'G', 'B', 'C'], ['3', '5', '7', '1']);
		t2('C', ['C', 'F', 'G'], ['1', '4', '5']);
		t2('C', ['C', 'E', 'G', 'A'], ['1', '3', '5', '6']);
		t2('C', ['C', 'D', 'G'], ['1', '2', '5']);
		t2('C', ['C', 'Db', 'E', 'G', 'Bb'], ['1', 'flat2', '3', '5', 'flat7']);
		t2('C', ['C', 'E', 'G', 'Bb', 'A'], ['1', '3', '5', 'flat7', '6']);
		t2('C', ['C', 'E', 'Ab', 'Bb'], ['1', '3', 'sharp5', 'flat7']);
		t2('C', ['C', 'E', 'G', 'B', 'Db'], ['1', '3', '5', '7', 'flat2']);
		t2('C', ['C', 'D', 'E', 'G', 'A'], ['1', '2', '3', '5', '6']);
		t2('C', ['C', 'D', 'Eb', 'G', 'A'], ['1', '2', 'flat3', '5', '6']);
	});
});
