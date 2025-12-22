import { describe, expect, it } from 'vitest';

import type { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import type { MusicDisplayOptions } from '$lib/musicDisplayOptions';
import { Chord } from './chord';
import { printChord } from './printChord';

describe(printChord, () => {
	const defaultOptions: MusicDisplayOptions = {
		flats: 'b',
		sharps: '#',
		diminished: 'dim',
		augmented: 'aug',
		major: 'maj',
		minor: 'm',
		halfDiminished: 'ø',
		slashNotation: true,
	};

	const t = (
		notes: CanonicalPitchClass[],
		output: string,
		options: Partial<MusicDisplayOptions> = {},
	) => {
		const c = Chord.guessFromPitches(notes);
		expect(printChord(c, { ...defaultOptions, ...options })).toEqual(output);
	};

	it('should accurately handle unison', () => {
		t(['C'], 'C (unison)');
		t(['Bb'], 'Bb (unison)');
	});

	it('should accurately handle intervals', () => {
		t(['C', 'Db'], 'C m2');
		t(['C', 'D'], 'C M2');
		t(['C', 'Eb'], 'C m3');
		t(['C', 'E'], 'C M3');
		t(['C', 'F'], 'C P4');
		t(['C', 'Gb'], 'C d5');
		t(['C', 'G'], 'C P5');
		t(['C', 'Ab'], 'C m6');
		t(['C', 'A'], 'C M6');
		t(['C', 'Bb'], 'C m7');
		t(['C', 'B'], 'C M7');
	});

	it('should accurately handle simple triads', () => {
		t(['C', 'E', 'G'], 'C');
		t(['C', 'Eb', 'G'], 'Cm');
		t(['C', 'Eb', 'Gb'], 'Cdim');
		t(['C', 'E', 'Ab'], 'Caug');
		t(['C', 'D', 'G'], 'C sus2');
		t(['C', 'F', 'G'], 'C sus4');
	});

	it('should accurately handle simple 7 chords', () => {
		t(['C', 'E', 'G', 'Bb'], 'C7');
		t(['C', 'E', 'G', 'B'], 'Cmaj7');
		t(['C', 'Eb', 'G', 'Bb'], 'Cm7');
		t(['C', 'Eb', 'G', 'B'], 'CmMaj7');
		t(['C', 'Eb', 'Gb', 'A'], 'Cdim7');
		t(['C', 'Eb', 'Gb', 'Bb'], 'Cø');
		t(['C', 'Eb', 'Gb', 'B'], 'CdimMaj7');
		t(['C', 'E', 'Ab', 'Bb'], 'Caug7');
		t(['C', 'E', 'Ab', 'B'], 'CaugMaj7');
		t(['C', 'F', 'G', 'Bb'], 'C7 sus4');
		t(['C', 'F', 'G', 'B'], 'Cmaj7 sus4');
		t(['C', 'D', 'G', 'Bb'], 'C7 sus2');
		t(['C', 'D', 'G', 'B'], 'Cmaj7 sus2');
	});

	it('should accurately handle simple 9 chords', () => {
		t(['C', 'E', 'G', 'Bb', 'D'], 'C9');
		t(['C', 'E', 'G', 'Bb', 'Db'], 'C7 b9');
		t(['C', 'E', 'G', 'B', 'D'], 'Cmaj9');
		t(['C', 'E', 'G', 'B', 'Db'], 'Cmaj7 b9');
		t(['C', 'Eb', 'G', 'Bb', 'D'], 'Cm9');
		t(['C', 'Eb', 'G', 'Bb', 'Db'], 'Cm7 b9');
		t(['C', 'Eb', 'G', 'B', 'D'], 'CmMaj9');
		t(['C', 'Eb', 'G', 'B', 'Db'], 'CmMaj7 b9');
		t(['C', 'E', 'G', 'Bb', 'Eb', 'F'], 'C11 #9');
	});

	it('should handle 6 and 6/9 shords', () => {
		t(['C', 'E', 'G', 'A'], 'C6');
		t(['C', 'Eb', 'G', 'A'], 'Cm6');
		t(['C', 'Eb', 'E', 'G', 'A'], 'Am7 add#11 / C');
		t(['C', 'D', 'E', 'G', 'A'], 'C6/9');
		t(['C', 'D', 'Eb', 'G', 'A'], 'Cm6/9');
		t(['C', 'E', 'G', 'Bb', 'Ab'], 'C7 addB13');
	});

	it('should handle add9 chords', () => {
		t(['C', 'E', 'G', 'D'], 'C add9');
	});

	it('should handle modifications', () => {
		t(['C', 'E', 'G', 'Bb', 'Db', 'D', 'F', 'A'], 'C13 b9 9');
		t(['C', 'E', 'G', 'Bb', 'Db', 'D'], 'C7 b9 9');
		t(['C', 'E', 'G', 'Bb', 'D', 'F', 'Gb'], 'C9 11 #11');
		t(['C', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Bb', 'D'], 'C7 9 #9 11 #11');
		t(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Bb', 'D'], 'C7 b9 9 #9 11 #11');
		t(['C', 'E', 'G', 'A', 'Bb'], 'C7 add13');
		t(['C', 'E', 'G', 'Bb', 'D', 'F', 'Ab'], 'C11 b13');
		t(['C', 'E', 'G', 'Bb', 'D', 'F', 'Ab', 'A'], 'C11 b13 13');
		t(
			['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
			'C maj7 7 b9 9 #9 11 #11 b13 13',
		);
		t(['C', 'Db', 'D', 'Eb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'], 'F7 b9 9 #9 11 #11 b13 13 / C');
		t(['C', 'E', 'G', 'Bb', 'B'], 'C maj7 7');
		t(['C', 'E', 'G', 'Bb', 'B', 'D'], 'Em7 add#11 addB13 / C');
		t(['C', 'E', 'Gb', 'Ab'], 'Abaug7 / C');
		t(['C', 'D', 'E', 'Gb', 'Ab', 'Bb'], 'Caug9 #11');
		t(['C', 'E', 'G', 'Bb', 'Eb', 'A'], 'C7 #9 add13');
		t(['C', 'E', 'G', 'Bb', 'F'], 'C7 add11');
	});

	it('should support inversions', () => {
		t(['C', 'F', 'A'], 'F / C');
		t(['C', 'D', 'Eb', 'F', 'Ab', 'Bb'], 'Fm7 add11 add13 / C');
		t(['G', 'Bb', 'C', 'E', 'G', 'A'], 'C7 add13 / G');
		t(['G', 'A', 'C', 'E', 'G', 'A'], 'Am7 / G');
		t(['G', 'C', 'E', 'G', 'A'], 'C6 / G');
		t(['C', 'F', 'B', 'D'], 'Dm7 add13 / C');
		t(['C', 'G', 'Bb'], 'C7');
	});

	it('should support other bases', () => {
		t(['D', 'Gb', 'A'], 'D');
		t(['F', 'Ab', 'C'], 'Fm');
	});

	it('should support inversion edge cases', () => {
		t(['G', 'F', 'B', 'E'], 'G7 add13');
		t(['Gb', 'A', 'C', 'D'], 'D7 / F#');
		t(['Eb', 'G', 'D', 'F'], 'Ebmaj9');
		t(['Bb', 'D', 'G'], 'Gm / Bb');
	});

	it('should properly guess slashed note enharmonically speaking', () => {
		t(['Gb', 'A', 'C', 'D'], 'D7 / F#');
		t(['Eb', 'Gb', 'B'], 'B / D#');
	});

	it('should handle all chord printing options', () => {
		// flats
		t(['C', 'E', 'G', 'Ab'], 'A♭augMaj7 / C', { flats: '♭' });
		t(['C', 'E', 'G', 'Ab'], 'AbaugMaj7 / C', { flats: 'b' });

		// sharps
		t(['C', 'E', 'Gb', 'G'], 'C add♯11', { sharps: '♯' });
		t(['C', 'E', 'Gb', 'G'], 'C add#11', { sharps: '#' });

		// maj
		t(['C', 'E', 'G', 'B'], 'CΔ7', { major: 'Δ' });
		t(['C', 'E', 'G', 'B'], 'Cmaj7', { major: 'maj' });

		// min
		t(['C', 'Eb', 'G', 'Bb'], 'C-7', { minor: '-' });
		t(['C', 'Eb', 'G', 'Bb'], 'Cm7', { minor: 'm' });
		t(['C', 'Eb', 'G', 'B'], 'C-Maj7', { minor: '-' });
		t(['C', 'Eb', 'G', 'B'], 'CmMaj7', { minor: 'm' });

		// slash notation
		t(['Gb', 'A', 'C', 'D'], 'D7 / F#', { slashNotation: true });
		t(['Eb', 'Gb', 'B'], 'B / D#', { slashNotation: true });
		t(['Gb', 'A', 'C', 'D'], 'D7', { slashNotation: false });
		t(['Eb', 'Gb', 'B'], 'B', { slashNotation: false });

		// diminished
		t(['C', 'Eb', 'Gb'], 'C°', { diminished: '°' });
		t(['C', 'Eb', 'Gb'], 'Cdim', { diminished: 'dim' });

		// augmented
		t(['C', 'E', 'Ab'], 'C+', { augmented: '+' });
		t(['C', 'E', 'Ab'], 'Caug', { augmented: 'aug' });
		t(['C', 'E', 'Ab'], 'C #5', { augmented: '#5' });
		t(['C', 'E', 'Ab', 'Bb'], 'C7 #5', { augmented: '#5' });

		// half diminished
		t(['C', 'Eb', 'Gb', 'Bb'], 'Cø', { halfDiminished: 'ø' });
		t(['C', 'Eb', 'Gb', 'Bb'], 'Cm7 b5', { halfDiminished: 'm7b5' });
	});
});
