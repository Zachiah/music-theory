import { CanonicalPitch } from '$lib/CanonicalPitch';
import { Pitch } from '$lib/Pitch';
import { PitchConstituents } from '$lib/PitchConstituents';
import { breakApartArray, inclusiveRange, maxBy, minBy } from '$lib/util';

type CanonicalPitchLetter = CanonicalPitch & { pitchClass: PitchConstituents.LetterName };

export const STAFF_LOW: CanonicalPitchLetter = { pitchClass: 'C', octave: 2 };
export const STAFF_HIGH: CanonicalPitchLetter = { pitchClass: 'C', octave: 6 };

export const BASS_FIRST_EXTENSION_BELOW: CanonicalPitchLetter = { pitchClass: 'E', octave: 2 };
export const BASS_BOTTOM: CanonicalPitchLetter = { pitchClass: 'G', octave: 2 };
export const BASS_TOP: CanonicalPitchLetter = { pitchClass: 'A', octave: 3 };
export const TREBLE_BOTTOM: CanonicalPitchLetter = { pitchClass: 'E', octave: 4 };
export const TREBLE_TOP: CanonicalPitchLetter = { pitchClass: 'F', octave: 5 };
export const TREBLE_FIRST_EXTENSION_ABOVE: CanonicalPitchLetter = { pitchClass: 'A', octave: 5 };

export const STAFF_LOW_POS = PitchConstituents.letterBasedHeight(
	STAFF_LOW.pitchClass,
	STAFF_LOW.octave
);
export const STAFF_HIGH_POS = PitchConstituents.letterBasedHeight(
	STAFF_HIGH.pitchClass,
	STAFF_HIGH.octave
);
export const STAFF_SIZE = STAFF_HIGH_POS - STAFF_LOW_POS;
export const BASS_BOTTOM_POS = PitchConstituents.letterBasedHeight(
	BASS_BOTTOM.pitchClass,
	BASS_BOTTOM.octave
);
export const TREBLE_BOTTOM_POS = PitchConstituents.letterBasedHeight(
	TREBLE_BOTTOM.pitchClass,
	TREBLE_BOTTOM.octave
);

export type StaffLine = { pos: number; full: boolean };

export const filterPitchesInRange = (
	pitches: Pitch[],
	low: CanonicalPitch,
	high: CanonicalPitch
) => {
	const l = CanonicalPitch.height(low);
	const h = CanonicalPitch.height(high);

	return pitches.filter((p) => {
		const v = CanonicalPitch.height(Pitch.toCanonical(p));

		return l <= v && v <= h;
	});
};

const posesWithFull = (poses: number[], full: boolean): StaffLine[] => {
	return poses.map((p) => ({ pos: p, full }));
};

const getLinePosesForRange = (pitches: Pitch[], full: boolean): StaffLine[] => {
	if (!pitches.length) {
		return [];
	}

	const low = minBy(pitches, (p) => CanonicalPitch.height(Pitch.toCanonical(p)));
	const high = maxBy(pitches, (p) => CanonicalPitch.height(Pitch.toCanonical(p)));

	const lowPos = PitchConstituents.letterBasedHeight(low.pitchClass.letter, low.octave);
	const highPos = PitchConstituents.letterBasedHeight(high.pitchClass.letter, high.octave);

	const allPoses = inclusiveRange(lowPos, highPos);

	const linePoses = allPoses.filter((p) => p % 2 === 0);

	return posesWithFull(linePoses, full);
};

export const getVisibleLinePoses = (pitches: Pitch[]): StaffLine[] => {
	const letters = pitches.map((p) => ({ ...p, pitchClass: { ...p.pitchClass, modifier: 0 } }));

	const bassExtensionsRaw = filterPitchesInRange(letters, STAFF_LOW, BASS_FIRST_EXTENSION_BELOW);
	const bassExtensions: Pitch[] = bassExtensionsRaw.length
		? [...bassExtensionsRaw, Pitch.fromCanonical(BASS_FIRST_EXTENSION_BELOW)]
		: [];

	const trebleExtensionsRaw = filterPitchesInRange(
		letters,
		TREBLE_FIRST_EXTENSION_ABOVE,
		STAFF_HIGH
	);
	const trebleExtensions: Pitch[] = trebleExtensionsRaw.length
		? [...trebleExtensionsRaw, Pitch.fromCanonical(TREBLE_FIRST_EXTENSION_ABOVE)]
		: [];

	const printedPitches = letters.map((p) =>
		Pitch.print({ ...p, pitchClass: { ...p.pitchClass, modifier: 0 } })
	);
	const showMiddle =
		printedPitches.includes('C4') ||
		(printedPitches.includes('D4') && printedPitches.includes('B3'));

	return [
		...getLinePosesForRange(bassExtensions, false),
		...getLinePosesForRange(
			[Pitch.fromCanonical(BASS_BOTTOM), Pitch.fromCanonical(BASS_TOP)],
			true
		),
		...(showMiddle ? [{ pos: PitchConstituents.letterBasedHeight('C', 4), full: false }] : []),
		...getLinePosesForRange(
			[Pitch.fromCanonical(TREBLE_BOTTOM), Pitch.fromCanonical(TREBLE_TOP)],
			true
		),
		...getLinePosesForRange(trebleExtensions, false)
	];
};

export type PitchWithAlignment = {
	pitch: Pitch;
	alignment: number;
	natural: boolean;
};

const splitByLine = (pitches: Pitch[], individual: boolean): Pitch[][] => {
	return breakApartArray(pitches, (a, b) => {
		const ah = PitchConstituents.letterBasedHeight(a.pitchClass.letter, a.octave);
		const bh = PitchConstituents.letterBasedHeight(b.pitchClass.letter, b.octave);

		return bh - ah <= (individual ? 0 : 1);
	});
};

const getModifierSpace = (modifier: number): number => {
	return Math.ceil(Math.abs(modifier) / 2);
};

const getTakenSpaces = (data: PitchWithAlignment[]) => {
	return data.flatMap((item) => {
		const modifiersSpaceTaken =
			getModifierSpace(item.pitch.pitchClass.modifier) + (item.natural ? 1 : 0);

		return Array.from(
			{ length: modifiersSpaceTaken + 1 },
			(_, idx) => item.alignment - idx
		).toReversed();
	});
};

const getFirstAvailableSpace = (data: number[], needed: number): number => {
	if (!data.includes(0)) {
		return 0;
	}

	const compliment = Array.from({ length: Math.max(...data) }, (_, idx) => idx).filter(
		(num) => !data.includes(num)
	);

	const grouped = breakApartArray(compliment, (a, b) => b - a <= 1);

	const foundGroup = grouped.find((group) => group.length >= needed);

	return foundGroup ? foundGroup[0] : Math.max(...data) + 1;
};

export const getAlignment = (pitches: Pitch[]): PitchWithAlignment[] => {
	const sorted = pitches.toSorted((a, b) => {
		const ah = CanonicalPitch.height(Pitch.toCanonical(a));
		const bh = CanonicalPitch.height(Pitch.toCanonical(b));

		return ah - bh;
	});

	const groups = splitByLine(sorted, false).map((group) => splitByLine(group, true));

	return groups.flatMap((group) => {
		const normal = getGroupAlignment(group, false);
		const offset = getGroupAlignment(group, true);

		const normalHighest = Math.max(...normal.map((n) => n.alignment));
		const offsetHighest = Math.max(...offset.map((n) => n.alignment));

		return normalHighest > offsetHighest ? offset : normal;
	});
};

const getGroupAlignment = (group: Pitch[][], offset: boolean): PitchWithAlignment[] => {
	const groupProcessed: PitchWithAlignment[][] = [];

	for (const [idx, lineGroup] of group.entries()) {
		const previouslyTaken = getTakenSpaces(groupProcessed[groupProcessed.length - 1] || []);

		groupProcessed.push(getLineGroupAlignment(lineGroup, previouslyTaken, offset && idx === 0));
	}

	return groupProcessed.flat();
};

const getLineGroupAlignment = (lineGroup: Pitch[], previouslyTaken: number[], offset: boolean) => {
	const res: PitchWithAlignment[] = [];

	for (const [idx, pitch] of lineGroup.entries()) {
		const currentlyTaken = getTakenSpaces(res);

		const natural = pitch.pitchClass.modifier === 0 && lineGroup.length > 1;

		const size = (() => {
			const rawModifierSize = getModifierSpace(pitch.pitchClass.modifier);

			return 1 + (natural ? 1 : 0) + rawModifierSize;
		})();

		const start =
			offset && idx === 0
				? 1
				: getFirstAvailableSpace([...previouslyTaken, ...currentlyTaken].toSorted(), size);

		res.push({
			pitch,
			alignment: start === 0 ? 0 : start + size - 1,
			natural
		});
	}

	return res;
};
