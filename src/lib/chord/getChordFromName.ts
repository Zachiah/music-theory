import { PitchClass } from '$lib/PitchClass';
import { Chord } from './chord';

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

	const { root, rest } = res;

	return new Chord(root, ['1', rest === '-' ? 'flat3' : '3', '5']);
};
