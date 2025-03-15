import { describe, expect, it } from 'vitest';

import { guessChord, GuessedChord } from './guessChord';

describe(guessChord, () => {
	it('should accurately handle simple triads', () => {
		expect(GuessedChord.print('C', guessChord([4, 3]))).toEqual('C');
		expect(GuessedChord.print('C', guessChord([3, 4]))).toEqual('Cm');
		expect(GuessedChord.print('C', guessChord([3, 3]))).toEqual('Cdim');
		expect(GuessedChord.print('C', guessChord([4, 4]))).toEqual('Caug');
		expect(GuessedChord.print('C', guessChord([2, 5]))).toEqual('C sus2');
		expect(GuessedChord.print('C', guessChord([5, 2]))).toEqual('C sus4');
	});

	it('should accurately handle simple 7 chords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3]))).toEqual('C7');
		expect(GuessedChord.print('C', guessChord([4, 3, 4]))).toEqual('Cmaj7');
		expect(GuessedChord.print('C', guessChord([3, 4, 3]))).toEqual('Cm7');
		expect(GuessedChord.print('C', guessChord([3, 4, 4]))).toEqual('CmMaj7');
		expect(GuessedChord.print('C', guessChord([3, 3, 3]))).toEqual('Cdim7');
		expect(GuessedChord.print('C', guessChord([3, 3, 4]))).toEqual('Cm7 b5');
		expect(GuessedChord.print('C', guessChord([3, 3, 5]))).toEqual('CdimMaj7');
		expect(GuessedChord.print('C', guessChord([4, 4, 2]))).toEqual('Caug7');
		expect(GuessedChord.print('C', guessChord([4, 4, 3]))).toEqual('CaugMaj7');
		expect(GuessedChord.print('C', guessChord([5, 2, 3]))).toEqual('C7 sus4');
		expect(GuessedChord.print('C', guessChord([5, 2, 4]))).toEqual('Cmaj7 sus4');
		expect(GuessedChord.print('C', guessChord([2, 5, 3]))).toEqual('C7 sus2');
		expect(GuessedChord.print('C', guessChord([2, 5, 4]))).toEqual('Cmaj7 sus2');
	});

	it('should accurately handle simple 9 chords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4]))).toEqual('C9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3]))).toEqual('C7 b9');
		expect(GuessedChord.print('C', guessChord([4, 3, 4, 3]))).toEqual('Cmaj9');
		expect(GuessedChord.print('C', guessChord([4, 3, 4, 2]))).toEqual('Cmaj7 b9');
		expect(GuessedChord.print('C', guessChord([3, 4, 3, 4]))).toEqual('Cm9');
		expect(GuessedChord.print('C', guessChord([3, 4, 3, 3]))).toEqual('Cm7 b9');
		expect(GuessedChord.print('C', guessChord([3, 4, 4, 3]))).toEqual('CmMaj9');
		expect(GuessedChord.print('C', guessChord([3, 4, 4, 2]))).toEqual('CmMaj7 b9');
	});

	it('should handle 6 shords', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 2]))).toEqual('C6');
		expect(GuessedChord.print('C', guessChord([3, 4, 2]))).toEqual('Cm6');
		expect(GuessedChord.print('C', guessChord([3, 1, 3, 2]))).toEqual('C add#9 add13');
	})

	it('should handle modifications', () => {
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3, 1, 3, 4]))).toEqual('C13 b9 9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 3, 1]))).toEqual('C7 b9 9');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 1]))).toEqual('C9 11 #11');
		expect(GuessedChord.print('C', guessChord([2, 1, 1, 1, 1, 1, 3, 4]))).toEqual('C7 9 #9 11 #11');
		expect(GuessedChord.print('C', guessChord([2, 1, 1, 1, 1, 1, 3, 4]))).toEqual('C7 9 #9 11 #11');
		expect(GuessedChord.print('C', guessChord([1, 1, 1, 1, 1, 1, 1, 3, 4]))).toEqual('C7 b9 9 #9 11 #11');
		expect(GuessedChord.print('C', guessChord([4, 3, 2, 1]))).toEqual('C7 add13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 3]))).toEqual('C11 b13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 4, 3, 3, 1]))).toEqual('C11 b13 13');

		expect(GuessedChord.print('C', guessChord([1,1,1,1,1,1,1,1,1,1,1]))).toEqual('C 7 maj7 b9 9 #9 11 #11 b13 13');
		expect(GuessedChord.print('C', guessChord([1, 1, 1, 2, 1, 1, 1, 1, 1, 1]))).toEqual('Cm 7 maj7 b9 9 11 #11 b13 13');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 1]))).toEqual('C 7 maj7');
		expect(GuessedChord.print('C', guessChord([4, 3, 3, 1, 3]))).toEqual('C9 7 maj7');
	})

	it.todo('should handle inversions of simple triads');
	it.todo('should handle out of order notes');
});
