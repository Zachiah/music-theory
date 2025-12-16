import { PitchClass } from '$lib/PitchClass';
import type { Chord } from './chord';

const readParts = (
	input: string
): { root: PitchClass; originalRoot: PitchClass; rest: string } | null => {
	const m = input.match(/^(?<root>[a-g][b#]*)(?<other>[^/]*)(\/\s*(?<originalRoot>[a-g][b#]*))?$/);
	if (!m) {
		return null;
	}

	const g = m.groups!;

	return {
		root: PitchClass.create(g.root)!,
		originalRoot: PitchClass.create(g.originalRoot || g.root)!,
		rest: g.other.trim()
	};
};

export const getChordFromName = (name: string): Chord | null => {
	const normalized = name
		.toLowerCase()
		.trim()
		.replaceAll('♭', 'b')
		.replaceAll('𝄫', 'bb')
		.replaceAll('♯', '#')
		.replaceAll('𝄪', '##')
		.replaceAll('augmented', '+')
		.replaceAll('aug', '+')
		.replaceAll('diminished', 'DIM')
		.replaceAll('dim', 'DIM')
		.replaceAll('°', 'DIM')
		.replaceAll('minor', '-')
		.replaceAll('min', '-')
		.replaceAll('m', '-')
		.replaceAll('DIM', 'dim')
		.replaceAll('suspended', 'sus');

	const res = readParts(normalized);

	if (!res) {
		return null;
	}

	const { root, originalRoot, rest } = res;

	return {
		root,
		originalRoot,
		major: false,
		minor: rest === '-',
		diminished: rest === 'dim',
		augmented: rest === '+' || rest === '#5',
		halfDiminished: false,
		sus4: rest === 'sus4',
		sus2: rest === 'sus2',
		five: false,
		flat5: false,
		seven: false,
		maj7: false,
		flat9: false,
		nine: false,
		sharp9: false,
		addFlat9: false,
		addSharp9: false,
		add9: false,
		eleven: false,
		sharp11: false,
		add11: false,
		addSharp11: false,
		thirteen: false,
		add13: false,
		flat13: false,
		addFlat13: false,
		six: false,
		flatSix: false,
		sixNine: false,
		hasThreeish: true,
		hasFivish: true,
		hasMiddlish: false,
		hasFive: false,
		hasSevenish: false,
		highestDegree: null
	};
};
