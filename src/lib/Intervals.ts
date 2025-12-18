import { CanonicalPitchClass } from './CanonicalPitchClass';
import { PitchClass } from './PitchClass';
import { PitchConstituents } from './PitchConstituents';
import { rotateArray } from './util';

export type Interval = { semitones: number; letters: number };
export namespace Interval {
	export const getPitchOffset = (interval: Interval, pitch: PitchClass): PitchClass => {
		const withoutExtraMods = PitchClass.withLetterName(
			CanonicalPitchClass.applyOffset(pitch.letter, interval.semitones),
			PitchConstituents.nextLetter(pitch.letter, interval.letters),
			'closest'
		);

		return { ...withoutExtraMods, modifier: withoutExtraMods.modifier + pitch.modifier };
	};

	export const print = (interval: Interval): string => {
		if (interval.letters > 7) {
			throw new Error('Letters too high');
		}

		const types: [string, 'p' | 'm', number][] = [
			['unison', 'p', 0],
			['2', 'm', 2],
			['3', 'm', 4],
			['4', 'p', 5],
			['5', 'p', 7],
			['6', 'm', 9],
			['7', 'm', 11]
		];

		const type = types[interval.letters];

		const modifier = (() => {
			const diff = interval.semitones - type[2];

			if (type[1] === 'm') {
				if (diff > 1 || diff < -2) {
					throw new Error('diff not printable');
				}

				return ['d', 'm', 'M', 'A'][diff + 2];
			}

			if (diff > 1 || diff < -1) {
				throw new Error('diff not printable');
			}

			return ['d', 'P', 'A'][diff + 1];
		})();

		return `${modifier}${type[0]}`;
	};
}

export type Intervals = Interval[];
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
