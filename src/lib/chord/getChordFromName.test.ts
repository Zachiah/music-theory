import { describe, it, expect } from 'vitest';
import { getChordFromName } from './getChordFromName';
import { PitchClass } from '$lib/PitchClass';
import { Chord } from './chord';

describe(getChordFromName, () => {
	const t = (n: string, c: Chord) => {
		expect(getChordFromName(n)).toEqual(c);
	};

	const n = (i: string) => PitchClass.create(i)!;

	it('should work', () => {
		t('C', new Chord(n('C'), ['1', '3', '5']));
		t('D', new Chord(n('D'), ['1', '3', '5']));
		t('E', new Chord(n('E'), ['1', '3', '5']));
		t('Bb', new Chord(n('Bb'), ['1', '3', '5']));

		t('Cm', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C m', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C-', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C -', new Chord(n('C'), ['1', 'flat3', '5']));
		t('D -', new Chord(n('D'), ['1', 'flat3', '5']));
		t('Bb -', new Chord(n('Bb'), ['1', 'flat3', '5']));

		t('C+', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C +', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('Caug', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C #5', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C #5', new Chord(n('C'), ['1', '3', 'sharp5']));

		t('Cdim', new Chord(n('C'), ['1', 'flat3', 'flat5']));
		t('C°', new Chord(n('C'), ['1', 'flat3', 'flat5']));

		t('Csus2', new Chord(n('C'), ['1', '2', '5']));
		t('C suspended2', new Chord(n('C'), ['1', '2', '5']));
		t('Csus4', new Chord(n('C'), ['1', '4', '5']));

		t('C7', new Chord(n('C'), ['1', '3', '5', 'flat7']));
		t('Cmaj7', new Chord(n('C'), ['1', '3', '5', '7']));
		t('Cmmaj7', new Chord(n('C'), ['1', 'flat3', '5', '7']));
		t('Cm7', new Chord(n('C'), ['1', 'flat3', '5', 'flat7']));
		t('Cdim7', new Chord(n('C'), ['1', 'flat3', 'flat5', 'flatflat7']));
		t('Cm7b5', new Chord(n('C'), ['1', 'flat3', 'flat5', 'flat7']));

		t('C9', new Chord(n('C'), ['1', '3', '5', 'flat7', '2']));
		t('Cmaj9', new Chord(n('C'), ['1', '3', '5', '7', '2']));

		t('C11', new Chord(n('C'), ['1', '3', '5', 'flat7', '2', '4']));
		t('Cmaj11', new Chord(n('C'), ['1', '3', '5', '7', '2', '4']));

		t('C13', new Chord(n('C'), ['1', '3', '5', 'flat7', '2', '4', '6']));
		t('Cmaj13', new Chord(n('C'), ['1', '3', '5', '7', '2', '4', '6']));
	});
});
