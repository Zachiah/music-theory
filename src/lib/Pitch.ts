import { CanonicalPitch } from './CanonicalPitch';
import type { MusicDisplayOptions } from './musicDisplayOptions';
import { PitchClass } from './PitchClass';

export type Pitch = {
	octave: number;
	pitchClass: PitchClass;
};

export namespace Pitch {
	export const toCanonical = (p: Pitch): CanonicalPitch => {
		return CanonicalPitch.applyOffset(
			{ pitchClass: p.pitchClass.letter, octave: p.octave },
			p.pitchClass.modifier
		);
	};

	export const fromCanonical = (p: CanonicalPitch): Pitch => {
		return {
			octave: p.octave,
			pitchClass: PitchClass.fromCanonicalPitchClass(p.pitchClass)
		};
	};

	export const parse = (str: string): Pitch | null => {
		const regex = /^([^-0-9]+)(-?)(\d+)$/;
		const match = str.match(regex);

		if (!match) {
			return null;
		}

		const pitchClass = PitchClass.create(match[1]);
		if (!pitchClass) {
			return null;
		}

		const negative = match[2] === '-' ? -1 : 1;
		return {
			octave: negative * +match[3],
			pitchClass: pitchClass
		};
	};

	export const print = (p: Pitch, options: MusicDisplayOptions) => {
		return `${PitchClass.print(p.pitchClass, options)}${p.octave}`;
	};

	export const id = (p: Pitch): string => {
		return `${PitchClass.id(p.pitchClass)}${p.octave}`;
	};
}
