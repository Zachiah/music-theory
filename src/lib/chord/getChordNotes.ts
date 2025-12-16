import type { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import type { Chord } from './chord';

export const getChordNotes = (chord: Chord): CanonicalPitchClass[] => {
	const rootPos = [chord.root];

	return [];
};
