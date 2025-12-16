import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import { PitchClass } from '$lib/PitchClass';
import { PitchConstituents } from '$lib/PitchConstituents';
import { modWithNegative } from '$lib/util';
import type { Chord } from './chord';

const getBigConf = (chord: Chord) => {
	if (chord.hasThreeish && chord.hasFivish) {
		return 1001;
	}
	if (chord.hasThreeish || chord.hasFivish) {
		return 1000;
	}
	return 0;
};

const getComplexity = (chord: Chord) => {
	return [
		chord.major,
		// Chords are implicitly major so we can't count
		// chord.minor,
		// chord.diminished,
		// chord.augmented,
		chord.sus4,
		chord.sus2,
		chord.flat5,
		chord.seven,
		chord.maj7,
		chord.flat9,
		chord.nine,
		chord.sharp9,
		chord.addFlat9,
		chord.addSharp9,
		chord.add9,
		chord.eleven,
		chord.sharp11,
		chord.add11,
		chord.addSharp11,
		chord.thirteen,
		chord.add13,
		chord.flat13,
		chord.addFlat13,
		//chord.six,
		chord.flatSix,
		chord.sixNine
	]
		.map<number>((b) => (b ? 1 : 0))
		.reduce((a, b) => a + b, 0);
};

const normalizeNoteString = (pitch: CanonicalPitchClass, availableNotes: PitchClass[]) => {
	return availableNotes.find((an) => {
		return PitchClass.toCanonicalPitchClass(an) === pitch;
	});
};

export const guessChordNoInversions = (
	pitches: CanonicalPitchClass[],
	originalRoot: CanonicalPitchClass,
	providedPitches: PitchClass[] = []
): Chord => {
	const distanceFromC = CanonicalPitchClass.distanceFromC(pitches[0]);

	const distance = modWithNegative(distanceFromC, CanonicalPitchClass.pitches.length);

	const cpc = [...new Set(pitches.map((p) => CanonicalPitchClass.applyOffset(p, -distance)))];

	const diminished =
		cpc.includes('Eb') &&
		cpc.includes('Gb') &&
		!cpc.includes('E') &&
		!cpc.includes('G') &&
		!cpc.includes('Bb');
	const halfDiminished =
		cpc.length === 4 && cpc.includes('Eb') && cpc.includes('Gb') && cpc.includes('Bb');
	const minor = cpc.includes('Eb') && !cpc.includes('E') && !diminished && !halfDiminished;
	const major = cpc.includes('B') && !cpc.includes('Bb');
	const augmented = cpc.includes('E') && cpc.includes('Ab') && !cpc.includes('G');
	const sus4 = cpc.includes('F') && !cpc.includes('E') && !cpc.includes('Eb');
	const sus2 = cpc.includes('D') && !cpc.includes('E') && !cpc.includes('Eb') && !cpc.includes('F');
	const flat5 =
		cpc.includes('Gb') && !cpc.includes('G') && !diminished && !augmented && !halfDiminished;
	const five = cpc.includes('G') && cpc.length === 2;

	const maj7 = cpc.includes('B') && cpc.includes('Bb');
	const seven = maj7;

	const hasSeven = (diminished && cpc.includes('A')) || cpc.includes('B') || cpc.includes('Bb');

	const sixNineChordNotes: CanonicalPitchClass[] = ['C', 'D', 'E', 'Eb', 'G', 'A'];
	const isSixNineChord =
		cpc.every((n) => sixNineChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('A') &&
		cpc.includes('D');

	const flat9 = hasSeven && cpc.includes('Db');
	const addFlat9 = !isSixNineChord && !hasSeven && cpc.includes('Db');
	const sharp9 = hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const addSharp9 = !isSixNineChord && !hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const nine = (flat9 || sharp9) && cpc.includes('D');
	const add9 = !isSixNineChord && !hasSeven && !sus2 && cpc.includes('D');

	const hasNine =
		hasSeven &&
		(cpc.includes('D') || cpc.includes('Db') || (cpc.includes('E') && cpc.includes('Eb')));

	const sharp11 = hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented);
	const addSharp11 = !hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented);
	const eleven = sharp11 && cpc.includes('F');
	const add11 = !hasNine && !sus4 && cpc.includes('F');

	const hasEleven = hasNine && (cpc.includes('F') || cpc.includes('Gb'));

	const sixChordNotes: CanonicalPitchClass[] = ['C', 'E', 'Eb', 'G', 'A'];
	const isSixChord =
		cpc.every((n) => sixChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('A');

	const flatSixChordNotes: CanonicalPitchClass[] = ['C', 'E', 'Eb', 'G', 'Ab'];
	const isFlatSixChord =
		!augmented &&
		cpc.every((n) => flatSixChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('Ab');

	const flat13 = hasEleven && cpc.includes('Ab') && !augmented;
	const addFlat13 = !isFlatSixChord && !hasEleven && cpc.includes('Ab') && !augmented;
	const thirteen = flat13 && cpc.includes('A');
	const add13 = !isSixNineChord && !isSixChord && !diminished && !hasEleven && cpc.includes('A');

	const highestDegree = (() => {
		if (isSixNineChord || isSixChord || halfDiminished) {
			return null;
		}
		if (!add13 && !thirteen && cpc.includes('A') && !diminished) {
			return 13;
		}

		if (!add11 && !eleven && cpc.includes('F') && !sus4) {
			return 11;
		}

		if (!add9 && !nine && cpc.includes('D') && !sus2) {
			return 9;
		}

		if (!seven && (cpc.includes('B') || cpc.includes('Bb') || (diminished && cpc.includes('A')))) {
			return 7;
		}

		return null;
	})();

	const hasFivish =
		cpc.includes('G') || augmented || diminished || halfDiminished || (minor && flat5);
	const hasThreeish = cpc.includes('E') || cpc.includes('Eb');
	const hasMiddlish = cpc.includes('E') || cpc.includes('Eb') || sus2 || sus4;
	const hasSevenish = seven || maj7 || (highestDegree || 0) >= 7;

	const canonicalized = {
		root: pitches[0],
		originalRoot,
		major,
		minor,
		diminished,
		halfDiminished,
		augmented,
		sus4,
		sus2,
		highestDegree,
		five,
		flat5,
		seven,
		maj7,
		flat9,
		nine,
		sharp9,
		addFlat9,
		addSharp9,
		add9,
		add11,
		add13,
		eleven,
		addSharp11,
		sharp11,
		flat13,
		addFlat13,
		thirteen,
		sixNine: isSixNineChord,
		six: isSixChord,
		flatSix: isFlatSixChord,
		hasFive: cpc.includes('G'),
		hasFivish,
		hasThreeish,
		hasMiddlish,
		hasSevenish
	};

	const availablePitches = (() => {
		if (providedPitches.length !== 0) {
			return providedPitches;
		}

		const scale = canonicalized.minor ? [2, 1, 2, 2, 1, 2] : [2, 2, 1, 2, 2, 2];

		return scale.reduce(
			(notes, interval) => {
				const last = notes[notes.length - 1];
				const newCanonical = CanonicalPitchClass.applyOffset(
					PitchClass.toCanonicalPitchClass(last),
					interval
				);
				return [
					...notes,
					PitchClass.withLetterName(
						newCanonical,
						PitchConstituents.nextLetter(last.letter, 1),
						'closest'
					)
				];
			},
			[PitchClass.fromCanonicalPitchClass(canonicalized.root)]
		);
	})();

	const betterRoot =
		normalizeNoteString(canonicalized.root, availablePitches) ??
		PitchClass.fromCanonicalPitchClass(canonicalized.root);
	const betterOriginalRoot =
		normalizeNoteString(canonicalized.originalRoot, availablePitches) ??
		PitchClass.fromCanonicalPitchClass(canonicalized.originalRoot);

	return {
		...canonicalized,
		root: betterRoot,
		originalRoot: betterOriginalRoot
	};
};

export const guessChord = (
	canonicalPitches: CanonicalPitchClass[],
	providedPitches: PitchClass[] = []
): Chord => {
	const rotate = <T>(by: number, arr: T[]): T[] => {
		if (by === 0) {
			return arr;
		}

		return rotate(by - 1, arr.slice(1).concat(arr[0]));
	};

	const allPossible = canonicalPitches
		.map((_, idx) => rotate(idx, canonicalPitches))
		.map((p) => guessChordNoInversions(p, canonicalPitches[0], providedPitches));

	const bestRes = allPossible.reduce<{ c: Chord; conf: number; done: boolean }>(
		(best, curr) => {
			if (best.done) {
				return best;
			}

			const currConf = getBigConf(curr) - getComplexity(curr);

			const wouldBeDone = curr.hasMiddlish && curr.hasSevenish;

			if (currConf > best.conf) {
				return { c: curr, conf: currConf, done: wouldBeDone };
			}
			return best;
		},
		{ c: allPossible[0], conf: 0, done: false }
	);

	return bestRes.c;
};
