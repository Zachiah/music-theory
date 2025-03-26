import { CanonicalPitchClass } from './CanonicalPitchClass';
import { PitchClass } from './PitchClass';
import { modWithNegative } from './util';

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

	const height = (pitch: CanonicalPitch) => {
		const pitches = CanonicalPitchClass.pitches;

		const fromOctave = pitch.octave * pitches.length;
		const extra = modWithNegative(
			pitches.indexOf(pitch.pitchClass) - pitches.indexOf('C'),
			pitches.length
		);

		return fromOctave + extra;
	};

	export const sort = (pitches: CanonicalPitch[]): CanonicalPitch[] => {
		return pitches.sort((a, b) => {
			return height(a) - height(b);
		});
	};

	export const parse = (str: string): CanonicalPitch | null => {
		const regex = /^(\D+)(\d+)$/;
		const match = str.match(regex);

		if (!match) {
			return null;
		}

		const pitchClass = PitchClass.create(match[1]);
		if (!pitchClass) {
			return null;
		}

		return {
			octave: +match[2],
			pitchClass: PitchClass.toCanonical(pitchClass)
		};
	};

	export const print = (p: CanonicalPitch) => {
		return `${p.pitchClass}${p.octave}`;
	};
}
