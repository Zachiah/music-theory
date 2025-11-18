import { modWithNegative } from './util';

export namespace CanonicalPitchClass {
	export const pitches = ['A', 'Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab'] as const;

	export type CanonicalPitchClass = (typeof pitches)[number];

	export const applyOffset = (p: CanonicalPitchClass, offset: number) => {
		const idx = pitches.indexOf(p);

		const offsetIdx = modWithNegative(idx + offset, pitches.length);

		return pitches[offsetIdx];
	};

	export const distanceFromC = (p: CanonicalPitchClass) => {
		return modWithNegative(pitches.indexOf(p) - pitches.indexOf('C'), pitches.length);
	};

	export const crossesCBoundary = (lower: CanonicalPitchClass, higher: CanonicalPitchClass) => {
		return distanceFromC(lower) >= distanceFromC(higher);
	};
}

export type CanonicalPitchClass = CanonicalPitchClass.CanonicalPitchClass;
