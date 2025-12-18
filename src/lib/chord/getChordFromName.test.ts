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

		// t('C+', { augmented: true });
		// t('C +', { augmented: true });
		// t('Caug', { augmented: true });
		// t('D #5', { root: n('D'), originalRoot: n('D'), augmented: true });
		// t('D ♯5', { root: n('D'), originalRoot: n('D'), augmented: true });

		// t('Cdim', { diminished: true });
		// t('C°', { diminished: true });

		// t('Csus2', { sus2: true });
		// t('C suspended2', { sus2: true });
		// t('Csus4', { sus4: true });

		// // TODO:
		// // t('C7', { highestDegree: 7 });

		// t('C / E', { originalRoot: n('E') });
		// t('Caug/E', { augmented: true, originalRoot: n('E') });
	});
});
