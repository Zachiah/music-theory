import { describe, expect, it } from 'vitest';

import { guessChord, GuessedChord } from './guessChord';

describe(guessChord, () => {
	const defaultOptions: GuessedChord.PrintingOptions = {
		sixNine: true,
		six: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true,
	}

	it('should accurately handle simple triads', () => {
		expect(GuessedChord.print('C', guessChord([4, 3]), defaultOptions)).toEqual('C');
		expect(GuessedChord.print('C', guessChord([3, 4]), defaultOptions)).toEqual('Cm');
		expect(GuessedChord.print('C', guessChord([3, 3]), defaultOptions)).toEqual('C°');
		expect(GuessedChord.print('C', guessChord([4, 4]), defaultOptions)).toEqual('C+');
		expect(GuessedChord.print('C', guessChord([2, 5]), defaultOptions)).toEqual('C sus2');
		expect(GuessedChord.print('C', guessChord([5, 2]), defaultOptions)).toEqual('C sus4');
	});

	it('should accurately handle simple 7 chords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3]), defaultOptions)).toEqual('C7');
		expect(GuessedChord.print('C', guessChord([4, 3, 4]), defaultOptions)).toEqual('Cmaj7');
		expect(GuessedChord.print('C', guessChord([3, 4, 3]), defaultOptions)).toEqual('Cm7');
		expect(GuessedChord.print('C', guessChord([3, 4, 4]), defaultOptions)).toEqual('CmMaj7');
		expect(GuessedChord.print('C', guessChord([3, 3, 3]), defaultOptions)).toEqual('C°7');
		expect(GuessedChord.print('C', guessChord([3, 3, 4]), defaultOptions)).toEqual('Cm7 ♭5');
		expect(GuessedChord.print('C', guessChord([3, 3, 5]), defaultOptions)).toEqual('C°Maj7');
		expect(GuessedChord.print('C', guessChord([4, 4, 2]), defaultOptions)).toEqual('C+7');
		expect(GuessedChord.print('C', guessChord([4, 4, 3]), defaultOptions)).toEqual('C+Maj7');
		expect(GuessedChord.print('C', guessChord([5, 2, 3]), defaultOptions)).toEqual('C7 sus4');
		expect(GuessedChord.print('C', guessChord([5, 2, 4]), defaultOptions)).toEqual('Cmaj7 sus4');
		expect(GuessedChord.print('C', guessChord([2, 5, 3]), defaultOptions)).toEqual('C7 sus2');
		expect(GuessedChord.print('C', guessChord([2, 5, 4]), defaultOptions)).toEqual('Cmaj7 sus2');
	});

	it('should accurately handle simple 9 chords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4]), defaultOptions)).toEqual('C9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3]), defaultOptions)).toEqual('C7 ♭9');
		expect(GuessedChord.print('C', guessChord([4, 3, 4, 3]), defaultOptions)).toEqual('Cmaj9');
		expect(GuessedChord.print('C', guessChord([4, 3, 4, 2]), defaultOptions)).toEqual('Cmaj7 ♭9');
		expect(GuessedChord.print('C', guessChord([3, 4, 3, 4]), defaultOptions)).toEqual('Cm9');
		expect(GuessedChord.print('C', guessChord([3, 4, 3, 3]), defaultOptions)).toEqual('Cm7 ♭9');
		expect(GuessedChord.print('C', guessChord([3, 4, 4, 3]), defaultOptions)).toEqual('CmMaj9');
		expect(GuessedChord.print('C', guessChord([3, 4, 4, 2]), defaultOptions)).toEqual('CmMaj7 ♭9');
	});

	it('should handle 6 and 6/9 shords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 2]), defaultOptions)).toEqual('C6');
		expect(GuessedChord.print('C', guessChord([3, 4, 2]), defaultOptions)).toEqual('Cm6');
		expect(GuessedChord.print('C', guessChord([3, 1, 3, 2]), defaultOptions)).toEqual('C add♯9 add13');
		expect(GuessedChord.print('C', guessChord([2, 2, 3, 2]), defaultOptions)).toEqual('C6/9')
		expect(GuessedChord.print('C', guessChord([2, 1, 4, 2]), defaultOptions)).toEqual('Cm6/9')

		expect(GuessedChord.print('C', guessChord([4, 3, 2]), {...defaultOptions, six: false})).toEqual('C add13');
		expect(GuessedChord.print('C', guessChord([3, 4, 2]), {...defaultOptions, six: false})).toEqual('Cm add13');
		expect(GuessedChord.print('C', guessChord([2, 2, 3, 2]), {...defaultOptions, sixNine: false})).toEqual('C add9 add13')
		expect(GuessedChord.print('C', guessChord([2, 1, 4, 2]), {...defaultOptions, sixNine: false})).toEqual('Cm add9 add13')
	})

	it('should handle modifications', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3, 1, 3, 4]), defaultOptions)).toEqual('C13 ♭9 9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3, 1]), defaultOptions)).toEqual('C7 ♭9 9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 1]), defaultOptions)).toEqual('C9 11 ♯11');
		expect(GuessedChord.print('C', guessChord([2, 1, 1, 1, 1, 1, 3, 4]), defaultOptions)).toEqual('C7 9 ♯9 11 ♯11');
		expect(GuessedChord.print('C', guessChord([2, 1, 1, 1, 1, 1, 3, 4]), defaultOptions)).toEqual('C7 9 ♯9 11 ♯11');
		expect(GuessedChord.print('C', guessChord([1, 1, 1, 1, 1, 1, 1, 3, 4]), defaultOptions)).toEqual('C7 ♭9 9 ♯9 11 ♯11');
		expect(GuessedChord.print('C', guessChord([4, 3, 2, 1]), defaultOptions)).toEqual('C7 add13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 3]), defaultOptions)).toEqual('C11 ♭13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 3, 1]), defaultOptions)).toEqual('C11 ♭13 13');

		expect(GuessedChord.print('C', guessChord([1,1,1,1,1,1,1,1,1,1,1]), defaultOptions)).toEqual('C 7 maj7 ♭9 9 ♯9 11 ♯11 ♭13 13');
		expect(GuessedChord.print('C', guessChord([1, 1, 1, 2, 1, 1, 1, 1, 1, 1]), defaultOptions)).toEqual('Cm 7 maj7 ♭9 9 11 ♯11 ♭13 13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 1]), defaultOptions)).toEqual('C 7 maj7');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 1, 3]), defaultOptions)).toEqual('C9 7 maj7');
		expect(GuessedChord.print('C', guessChord([4, 2, 2]), defaultOptions)).toEqual('C+ add♯11');
		expect(GuessedChord.print('C', guessChord([2, 2, 2, 2, 2]), defaultOptions)).toEqual('C+9 ♯11');
		expect(GuessedChord.print('C', guessChord([3, 5]), defaultOptions)).toEqual('Cm add♭13');
		expect(GuessedChord.print('C', guessChord([2, 1, 2, 3, 2]), defaultOptions)).toEqual('Cm11 ♭13');
	})

	it('should handle other flat and sharp displays', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 1]), {...defaultOptions, properFlats: false})).toEqual('C addB13')
		expect(GuessedChord.print('C', guessChord([4, 2, 1]), {...defaultOptions, properSharps: false})).toEqual('C add#11')
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3]), {...defaultOptions, properFlats: false})).toEqual('C7 b9')
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 4]), {...defaultOptions, properSharps: false})).toEqual('C9 #11')
	})

	it('should properly do "dim" or "°" based on options', () => {
		expect(GuessedChord.print('C', guessChord([3, 3]), defaultOptions)).toEqual('C°')
		expect(GuessedChord.print('C', guessChord([3, 3]), {...defaultOptions, properDiminished: false})).toEqual('Cdim')
	})

	it('should properly do "aug" or "+" based on options', () => {
		expect(GuessedChord.print('C', guessChord([4, 4]), defaultOptions)).toEqual('C+')
		expect(GuessedChord.print('C', guessChord([4, 4]), {...defaultOptions, properAugmented: false})).toEqual('Caug')
	})

	it.todo('should handle inversions of simple triads');
	it.todo('should handle out of order notes');
});
