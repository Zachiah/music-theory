import { CanonicalPitchClass } from './CanonicalPitchClass';
import { PitchClass } from './PitchClass';

export type CanonicalPitch = {
	octave: number;
	pitchClass: CanonicalPitchClass;
};

export namespace CanonicalPitch {
	export const applyOffset = (p: CanonicalPitch, offset: number): CanonicalPitch => {
		if (offset === 0) {
			return p;
		}

		const movement = offset > 0 ? 1 : -1;

		const octave = (() => {
			if (p.pitchClass === 'B' && movement === 1) {
				return p.octave + 1;
			}

			if (p.pitchClass === 'C' && movement === -1) {
				return p.octave - 1;
			}

			return p.octave;
		})();

		return applyOffset(
			{
				octave,
				pitchClass: CanonicalPitchClass.applyOffset(p.pitchClass, movement)
			},
			offset - movement
		);
	};

	export const height = (pitch: CanonicalPitch) => {
		const pitches = CanonicalPitchClass.pitches;

		const fromOctave = pitch.octave * pitches.length;
		const extra = CanonicalPitchClass.distanceFromC(pitch.pitchClass);

		return fromOctave + extra;
	};

	export const parse = (str: string): CanonicalPitch | null => {
		const regex = /^([^-0-9]+)(-?)(\d+)$/;
		const match = str.match(regex);

		if (!match) {
			return null;
		}

		const pitchClass = PitchClass.create(match[1]);
		if (!pitchClass) {
			return null;
		}

		const negative = match[2] === '-' ? -1 : 1
		return {
			octave: negative * +match[3],
			pitchClass: PitchClass.toCanonicalPitchClass(pitchClass)
		};
	};

	export const print = (p: CanonicalPitch) => {
		return `${p.pitchClass}${p.octave}`;
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
}
