import { modWithNegative } from './util';

export namespace CanonicalPitchClass {
	export const pitches = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'] as const;

	export type CanonicalPitchClass = (typeof pitches)[number];

	export const applyOffset = (p: CanonicalPitchClass, offset: number) => {
		const idx = pitches.indexOf(p);

		const offsetIdx = modWithNegative(idx + offset, pitches.length);

		return pitches[offsetIdx];
	};
}

export type CanonicalPitchClass = CanonicalPitchClass.CanonicalPitchClass;
