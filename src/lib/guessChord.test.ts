import { describe, expect, it } from 'vitest';

import { guessChord, GuessedChord } from './guessChord';

describe(guessChord, () => {
	const defaultOptions: GuessedChord.PrintingOptions = {
		sixNine: true,
		six: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	};

	it('should accurately handle simple triads', () => {
		expect(GuessedChord.print(guessChord(['C', 'E', 'G']), defaultOptions)).toEqual('C');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G']), defaultOptions)).toEqual('Cm');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'Gb']), defaultOptions)).toEqual('C°');
		expect(GuessedChord.print(guessChord(['C', 'E', 'Ab']), defaultOptions)).toEqual('C+');
		expect(GuessedChord.print(guessChord(['C', 'D', 'G']), defaultOptions)).toEqual('C sus2');
		expect(GuessedChord.print(guessChord(['C', 'F', 'G']), defaultOptions)).toEqual('C sus4');
	});

	it('should accurately handle simple 7 chords', () => {
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb']), defaultOptions)).toEqual('C7');
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'B']), defaultOptions)).toEqual('Cmaj7');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'Bb']), defaultOptions)).toEqual('Cm7');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'B']), defaultOptions)).toEqual('CmMaj7');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'Gb', 'A']), defaultOptions)).toEqual('C°7');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'Gb', 'Bb']), defaultOptions)).toEqual(
			'Cm7 ♭5'
		);
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'Gb', 'B']), defaultOptions)).toEqual(
			'C°Maj7'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'Ab', 'Bb']), defaultOptions)).toEqual('C+7');
		expect(GuessedChord.print(guessChord(['C', 'E', 'Ab', 'B']), defaultOptions)).toEqual('C+Maj7');
		expect(GuessedChord.print(guessChord(['C', 'F', 'G', 'Bb']), defaultOptions)).toEqual(
			'C7 sus4'
		);
		expect(GuessedChord.print(guessChord(['C', 'F', 'G', 'B']), defaultOptions)).toEqual(
			'Cmaj7 sus4'
		);
		expect(GuessedChord.print(guessChord(['C', 'D', 'G', 'Bb']), defaultOptions)).toEqual(
			'C7 sus2'
		);
		expect(GuessedChord.print(guessChord(['C', 'D', 'G', 'B']), defaultOptions)).toEqual(
			'Cmaj7 sus2'
		);
	});

	it('should accurately handle simple 9 chords', () => {
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'D']), defaultOptions)).toEqual(
			'C9'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'Db']), defaultOptions)).toEqual(
			'C7 ♭9'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'B', 'D']), defaultOptions)).toEqual(
			'Cmaj9'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'B', 'Db']), defaultOptions)).toEqual(
			'Cmaj7 ♭9'
		);
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'Bb', 'D']), defaultOptions)).toEqual(
			'Cm9'
		);
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'Bb', 'Db']), defaultOptions)).toEqual(
			'Cm7 ♭9'
		);
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'B', 'D']), defaultOptions)).toEqual(
			'CmMaj9'
		);
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'B', 'Db']), defaultOptions)).toEqual(
			'CmMaj7 ♭9'
		);
	});

	it('should handle 6 and 6/9 shords', () => {
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'A']), defaultOptions)).toEqual('C6');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'G', 'A']), defaultOptions)).toEqual('Cm6');
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'E', 'G', 'A']), defaultOptions)).toEqual(
			'Am7 add♯11'
		);
		expect(GuessedChord.print(guessChord(['C', 'D', 'E', 'G', 'A']), defaultOptions)).toEqual(
			'C6/9'
		);
		expect(GuessedChord.print(guessChord(['C', 'D', 'Eb', 'G', 'A']), defaultOptions)).toEqual(
			'Cm6/9'
		);

		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'A']), { ...defaultOptions, six: false })
		).toEqual('C add13');
		expect(
			GuessedChord.print(guessChord(['C', 'Eb', 'G', 'A']), { ...defaultOptions, six: false })
		).toEqual('Cm add13');
		expect(
			GuessedChord.print(guessChord(['C', 'D', 'E', 'G', 'A']), {
				...defaultOptions,
				sixNine: false
			})
		).toEqual('C add9 add13');
		expect(
			GuessedChord.print(guessChord(['C', 'D', 'Eb', 'G', 'A']), {
				...defaultOptions,
				sixNine: false
			})
		).toEqual('Cm add9 add13');
	});

	it('should handle modifications', () => {
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'Db', 'D', 'F', 'A']), defaultOptions)
		).toEqual('C13 ♭9 9');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'Db', 'D']), defaultOptions)
		).toEqual('C7 ♭9 9');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'D', 'F', 'Gb']), defaultOptions)
		).toEqual('C9 11 ♯11');
		expect(
			GuessedChord.print(
				guessChord(['C', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Bb', 'D']),
				defaultOptions
			)
		).toEqual('C7 9 ♯9 11 ♯11');
		expect(
			GuessedChord.print(
				guessChord(['C', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Bb', 'D']),
				defaultOptions
			)
		).toEqual('C7 9 ♯9 11 ♯11');
		expect(
			GuessedChord.print(
				guessChord(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Bb', 'D']),
				defaultOptions
			)
		).toEqual('C7 ♭9 9 ♯9 11 ♯11');
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'A', 'Bb']), defaultOptions)).toEqual(
			'C7 add13'
		);
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'D', 'F', 'Ab']), defaultOptions)
		).toEqual('C11 ♭13');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'D', 'F', 'Ab', 'A']), defaultOptions)
		).toEqual('C11 ♭13 13');

		expect(
			GuessedChord.print(
				guessChord(['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']),
				defaultOptions
			)
		).toEqual('C 7 maj7 ♭9 9 ♯9 11 ♯11 ♭13 13');
		expect(
			GuessedChord.print(
				guessChord(['C', 'Db', 'D', 'Eb', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']),
				defaultOptions
			)
		).toEqual('Cm 7 maj7 ♭9 9 11 ♯11 ♭13 13');
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'B']), defaultOptions)).toEqual(
			'C 7 maj7'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'B', 'D']), defaultOptions)).toEqual(
			'C9 7 maj7'
		);
		expect(GuessedChord.print(guessChord(['C', 'E', 'Gb', 'Ab']), defaultOptions)).toEqual(
			'Ab+7'
		);
		expect(
			GuessedChord.print(guessChord(['C', 'D', 'E', 'Gb', 'Ab', 'Bb']), defaultOptions)
		).toEqual('C+9 ♯11');
	});

	it('should handle other flat and sharp displays', () => {
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Ab']), {
				...defaultOptions,
				properFlats: false
			})
		).toEqual('C addB13');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'Gb', 'G']), {
				...defaultOptions,
				properSharps: false
			})
		).toEqual('C add#11');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'Db']), {
				...defaultOptions,
				properFlats: false
			})
		).toEqual('C7 b9');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'G', 'Bb', 'D', 'Gb']), {
				...defaultOptions,
				properSharps: false
			})
		).toEqual('C9 #11');
	});

	it('should properly do "dim" or "°" based on options', () => {
		expect(GuessedChord.print(guessChord(['C', 'Eb', 'Gb']), defaultOptions)).toEqual('C°');
		expect(
			GuessedChord.print(guessChord(['C', 'Eb', 'Gb']), {
				...defaultOptions,
				properDiminished: false
			})
		).toEqual('Cdim');
	});

	it('should properly do "aug" or "+" based on options', () => {
		expect(GuessedChord.print(guessChord(['C', 'E', 'Ab']), defaultOptions)).toEqual('C+');
		expect(
			GuessedChord.print(guessChord(['C', 'E', 'Ab']), {
				...defaultOptions,
				properAugmented: false
			})
		).toEqual('Caug');
	});

	it('should support inversions', () => {
		expect(GuessedChord.print(guessChord(['C', 'F', 'A']), defaultOptions)).toEqual('F');
		expect(
			GuessedChord.print(guessChord(['C', 'Eb', 'Ab']), {
				...defaultOptions,
				properAugmented: false
			})
		).toEqual('Ab');
		expect(
			GuessedChord.print(guessChord(['C', 'D', 'Eb', 'F', 'Ab', 'Bb']), defaultOptions)
		).toEqual('Cm11 ♭13');
		expect(GuessedChord.print(guessChord(['G', 'Bb', 'C', 'E', 'G', 'A']), defaultOptions)).toEqual(
			'C7 add13'
		);
		expect(GuessedChord.print(guessChord(['G', 'A', 'C', 'E', 'G', 'A']), defaultOptions)).toEqual(
			'Am7'
		);
		expect(GuessedChord.print(guessChord(['G', 'C', 'E', 'G', 'A']), defaultOptions)).toEqual('C6');
		expect(GuessedChord.print(guessChord(['C', 'F', 'B', 'D']), defaultOptions)).toEqual(
			'B° add♭9'
		);
		expect(GuessedChord.print(guessChord(['C', 'G', 'Bb']), defaultOptions)).toEqual('C7');
		expect(GuessedChord.print(guessChord(['C', 'Bb']), defaultOptions)).toEqual('C7');
	});

	it('should support other bases', () => {
		expect(GuessedChord.print(guessChord(['D', 'Gb', 'A']), defaultOptions)).toEqual('D');
		expect(GuessedChord.print(guessChord(['F', 'Ab', 'C']), defaultOptions)).toEqual('Fm');
	});

	it('should support inversion edge cases', () => {
		expect(GuessedChord.print(guessChord(['G', 'F', 'B', 'E']), defaultOptions)).toEqual('G7 add13')
		expect(GuessedChord.print(guessChord(['Gb', 'A', 'C', 'D']), defaultOptions)).toEqual('D7')
		expect(GuessedChord.print(guessChord(['Eb', 'G', 'D', 'F']), defaultOptions)).toEqual('Ebmaj9')
	})
});
