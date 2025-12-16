import { describe, it, expect } from 'vitest';
import { getChordFromName } from './getChordFromName';
import { Chord } from './chord';
import { PitchClass } from '$lib/PitchClass';
import { MusicDisplayOptions } from '$lib/musicDisplayOptions';
import { guessChord } from './guessChord';

const cMajor: Chord = {
	root: { letter: 'C', modifier: 0 },
	originalRoot: { letter: 'C', modifier: 0 },
	major: false,
	minor: false,
	diminished: false,
	augmented: false,
	halfDiminished: false,
	sus4: false,
	sus2: false,
	five: false,
	flat5: false,
	seven: false,
	maj7: false,
	flat9: false,
	nine: false,
	sharp9: false,
	addFlat9: false,
	addSharp9: false,
	add9: false,
	eleven: false,
	sharp11: false,
	add11: false,
	addSharp11: false,
	thirteen: false,
	add13: false,
	flat13: false,
	addFlat13: false,
	six: false,
	flatSix: false,
	sixNine: false,
	hasThreeish: true,
	hasFivish: true,
	hasMiddlish: false,
	hasFive: false,
	hasSevenish: false,
	highestDegree: null
};

describe(getChordFromName, () => {
	const t = (n: string, mods: Partial<Chord>) => {
		expect(getChordFromName(n)).toEqual({ ...cMajor, ...mods });
	};

	const n = (i: string) => PitchClass.create(i)!;

	it('should work', () => {
		t('C', {});
		t('D', { root: n('D'), originalRoot: n('D') });
		t('E', { root: n('E'), originalRoot: n('E') });
		t('Bb', { root: n('Bb'), originalRoot: n('Bb') });

		t('Cm', { minor: true });
		t('C m', { minor: true });
		t('C-', { minor: true });
		t('C -', { minor: true });
		t('Dm', { root: n('D'), originalRoot: n('D'), minor: true });
		t('Bbm', { root: n('Bb'), originalRoot: n('Bb'), minor: true });

		t('C+', { augmented: true });
		t('C +', { augmented: true });
		t('Caug', { augmented: true });
		t('D #5', { root: n('D'), originalRoot: n('D'), augmented: true });
		t('D ♯5', { root: n('D'), originalRoot: n('D'), augmented: true });

		t('Cdim', { diminished: true });
		t('C°', { diminished: true });

		t('Csus2', { sus2: true });
		t('C suspended2', { sus2: true });
		t('Csus4', { sus4: true });

		console.log(guessChord(['C', 'E', 'G', 'B']));
		t('C7', { highestDegree: 7 });

		t('C / E', { originalRoot: n('E') });
		t('Caug/E', { augmented: true, originalRoot: n('E') });
	});
});
