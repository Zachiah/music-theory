import { CanonicalPitchClass } from './CanonicalPitchClass';
import { PitchClass } from './PitchClass';
import { PitchConstituents } from './PitchConstituents';
import { rotateArray } from './util';

export type Intervals = { semitones: number; letters: number }[];
export namespace Intervals {
	export const rotate = (scale: Intervals, modeNumber: number): Intervals => {
		const withLastInterval = [
			...scale,
			{
				semitones:
					CanonicalPitchClass.pitches.length -
					scale.map((i) => i.semitones).reduce((a, b) => a + b, 0),
				letters:
					PitchConstituents.letterNames.length -
					scale.map((i) => i.letters).reduce((a, b) => a + b, 0)
			}
		];
		const offset = modeNumber - (1 % withLastInterval.length);

		return [...withLastInterval.slice(offset), ...withLastInterval.slice(0, offset - 1)];
	};

	export const getPitches = (scale: Intervals, startingPitch: PitchClass): PitchClass[] => {
		if (startingPitch.modifier !== 0) {
			return getPitches(scale, { ...startingPitch, modifier: 0 }).map((p) => ({
				...p,
				modifier: p.modifier + startingPitch.modifier
			}));
		}

		if (scale.length === 0) {
			return [startingPitch];
		}

		const nextLetterName = PitchConstituents.nextLetter(startingPitch.letter, scale[0].letters);
		const secondPitchResolved = CanonicalPitchClass.applyOffset(
			PitchClass.resolve(startingPitch),
			scale[0].semitones
		);
		const secondPitchProper = PitchClass.withLetterName(
			secondPitchResolved,
			nextLetterName,
			'closest'
		);

		return [startingPitch].concat(getPitches(scale.slice(1), secondPitchProper));
	};

	export const getAllOfChordPattern = (
		scale: Intervals,
		startingPitch: PitchClass,
		pattern: number[]
	): PitchClass[][] => {
		const pitches = getPitches(scale, startingPitch);
		return pitches
			.map((_, idx) => rotateArray(pitches, idx))
			.map((pitches) => pattern.map((p) => pitches[p % pitches.length]));
	};

	export const createWithSemitones = (letters: number, semitonesArray: number[]) => {
		return semitonesArray.map((semitones) => ({ semitones, letters }));
	};
}
