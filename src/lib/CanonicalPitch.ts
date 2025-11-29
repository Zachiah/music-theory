import { CanonicalPitchClass } from './CanonicalPitchClass';
import { inclusiveRange } from './util';

export type CanonicalPitch = {
	octave: number;
	pitchClass: CanonicalPitchClass;
};

export namespace CanonicalPitch {
	export const applyOffset = (p: CanonicalPitch, offset: number): CanonicalPitch => {
		if (isNaN(offset)) {
			throw new Error('Offset was NaN');
		}

		if (offset === 0) {
			return p;
		}

		const direction = offset > 0 ? 1 : -1;
		const amount = Math.abs(offset);

		const octaves = Math.floor(amount / CanonicalPitchClass.pitches.length);
		const extra = amount % CanonicalPitchClass.pitches.length;

		const newPitchClass = CanonicalPitchClass.applyOffset(p.pitchClass, extra * direction);

		const octaveModifier = (() => {
			const originalDistance = CanonicalPitchClass.distanceFromC(p.pitchClass);
			const newDistance = CanonicalPitchClass.distanceFromC(newPitchClass);

			if (direction === 1 && newDistance < originalDistance) {
				return 1;
			}

			if (direction === -1 && newDistance > originalDistance) {
				return -1;
			}

			return 0;
		})();

		return {
			octave: p.octave + octaves * direction + octaveModifier,
			pitchClass: newPitchClass
		};
	};

	export const height = (pitch: CanonicalPitch) => {
		const pitches = CanonicalPitchClass.pitches;

		const fromOctave = pitch.octave * pitches.length;
		const extra = CanonicalPitchClass.distanceFromC(pitch.pitchClass);

		return fromOctave + extra;
	};

	export const fromHeight = (height: number) => {
		return applyOffset({ pitchClass: 'C', octave: 0 }, height);
	};

	export const getRangeInclusive = (a: CanonicalPitch, b: CanonicalPitch) => {
		return inclusiveRange(height(a), height(b)).map((h) => fromHeight(h));
	};
}

export type CanonicalPitchArray = CanonicalPitch[];

export namespace CanonicalPitchArray {
	export const sort = (pitches: CanonicalPitchArray): CanonicalPitchArray => {
		return pitches.sort((a, b) => {
			return CanonicalPitch.height(a) - CanonicalPitch.height(b);
		});
	};

	export const fromCanonicalPitchClasses = (
		canonicalPitchClasses: CanonicalPitchClass[],
		startOctave: number
	): CanonicalPitchArray => {
		const [head, ...tail] = canonicalPitchClasses;

		const first: CanonicalPitch = { octave: startOctave, pitchClass: head };

		if (tail.length === 0) {
			return [first];
		}

		const secondOctave = CanonicalPitchClass.crossesCBoundary(head, tail[0])
			? startOctave + 1
			: startOctave;

		return [first, ...fromCanonicalPitchClasses(tail, secondOctave)];
	};

	export const includes = (pitches: CanonicalPitchArray, p: CanonicalPitch): boolean => {
		return !!pitches.find(
			(pitch) => pitch.pitchClass === p.pitchClass && pitch.octave === p.octave
		);
	};
}
