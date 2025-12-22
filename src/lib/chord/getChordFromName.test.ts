import { describe, it, expect } from 'vitest';
import { getChordFromName } from './getChordFromName';
import { PitchClass } from '$lib/PitchClass';
import { Chord } from './chord';

describe(getChordFromName, () => {
	const t = (n: string, c: Chord) => {
		expect(getChordFromName(n)).toEqual(c);
	};

	const n = (i: string) => PitchClass.create(i)!;

	it('parses major triads', () => {
		t('C', new Chord(n('C'), ['1', '3', '5']));
		t('D', new Chord(n('D'), ['1', '3', '5']));
		t('E', new Chord(n('E'), ['1', '3', '5']));
		t('Bb', new Chord(n('Bb'), ['1', '3', '5']));
	});

	it('parses slash chords', () => {
		t('C/E', new Chord(n('C'), ['3', '5', '1']));
		t('C/D', new Chord(n('C'), ['2', '3', '5', '1']));
		t('C / F', new Chord(n('C'), ['4', '5', '1', '3']));
	});

	it('parses minor triads', () => {
		t('Cm', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C m', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C-', new Chord(n('C'), ['1', 'flat3', '5']));
		t('C -', new Chord(n('C'), ['1', 'flat3', '5']));
		t('D -', new Chord(n('D'), ['1', 'flat3', '5']));
		t('Bb -', new Chord(n('Bb'), ['1', 'flat3', '5']));
	});

	it('parses augmented triads', () => {
		t('C+', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C +', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('Caug', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C #5', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C #5', new Chord(n('C'), ['1', '3', 'sharp5']));
	});

	it('parses diminished triads', () => {
		t('Cdim', new Chord(n('C'), ['1', 'flat3', 'flat5']));
		t('C°', new Chord(n('C'), ['1', 'flat3', 'flat5']));
	});

	it('parses suspended chords', () => {
		t('Csus2', new Chord(n('C'), ['1', '2', '5']));
		t('C sus', new Chord(n('C'), ['1', '4', '5']));
		t('Csus4', new Chord(n('C'), ['1', '4', '5']));
	});

	it('supports sixth chords', () => {
		t('C6', new Chord(n('C'), ['1', '3', '5', '6']));
	});

	it('supports 2 chords', () => {
		t('C2', new Chord(n('C'), ['1', '2', '5']));
	});

	it('supports seventh chords', () => {
		t('C7', new Chord(n('C'), ['1', '3', '5', 'flat7']));
		t('Cmaj7', new Chord(n('C'), ['1', '3', '5', '7']));
		t('Cmmaj7', new Chord(n('C'), ['1', 'flat3', '5', '7']));
		t('Cm7', new Chord(n('C'), ['1', 'flat3', '5', 'flat7']));
		t('Cdim7', new Chord(n('C'), ['1', 'flat3', 'flat5', 'flatflat7']));
		t('Cm7b5', new Chord(n('C'), ['1', 'flat3', 'flat5', 'flat7']));
		t('CMaj7', new Chord(n('C'), ['1', '3', '5', '7']));
	});

	it('supports ninth chords', () => {
		t('C9', new Chord(n('C'), ['1', '3', '5', 'flat7', '2']));
		t('Cmaj9', new Chord(n('C'), ['1', '3', '5', '7', '2']));
	});

	it('supports eleventh chords', () => {
		t('C11', new Chord(n('C'), ['1', '3', '5', 'flat7', '2', '4']));
		t('Cmaj11', new Chord(n('C'), ['1', '3', '5', '7', '2', '4']));
	});

	it('supports thirteenth chords', () => {
		t('C13', new Chord(n('C'), ['1', '3', '5', 'flat7', '2', '4', '6']));
		t('Cmaj13', new Chord(n('C'), ['1', '3', '5', '7', '2', '4', '6']));
	});

	it('supports altered extensions', () => {
		t('C11 b9', new Chord(n('C'), ['1', '3', '5', 'flat7', 'flat2', '4']));
		t('C11 #9', new Chord(n('C'), ['1', '3', '5', 'flat7', 'sharp2', '4']));
	});

	it('supports other flat and sharp symbols', () => {
		t('C ♯5', new Chord(n('C'), ['1', '3', 'sharp5']));
		t('C ♭5', new Chord(n('C'), ['1', '3', 'flat5']));
	});

	it('supports insanity', () => {
		t(
			'C maj7 7 b9 9 #9 11 #11 b13 13',
			new Chord(n('C'), [
				'1',
				'3',
				'5',
				'7',
				'flat7',
				'flat2',
				'2',
				'sharp2',
				'4',
				'sharp4',
				'flat6',
				'6',
			]),
		);
		t('C add9', new Chord(n('C'), ['1', '3', '5', '2']));
		t('C13 add#11', new Chord(n('C'), ['1', '3', '5', 'flat7', '2', '4', 'sharp4', '6']));
	});
});
