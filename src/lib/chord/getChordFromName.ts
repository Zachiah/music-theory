import { PitchClass } from '$lib/PitchClass';
import { Chord } from './chord';
import type { ScaleDegree } from './scaleDegree';

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
		.replaceAll('flat', 'b')
		.replaceAll('sharp', '#')
		.replaceAll('augmented', '+')
		.replaceAll('aug', '+')
		.replaceAll('major', 'maj')
		.replaceAll('maj', 'MAJ')
		.replaceAll('#5', '+')
		.replaceAll('diminished', 'DIM')
		.replaceAll('dim', 'DIM')
		.replaceAll('°', 'DIM')
		.replaceAll('minor', '-')
		.replaceAll('min', '-')
		.replaceAll('m', '-')
		.replaceAll('suspended', 'sus')
		.replaceAll('DIM', 'dim')
		.replaceAll('MAJ', 'maj');

	const res = readParts(normalized);

	if (!res) {
		return null;
	}

	const { root, rest } = res;

	const middle: ScaleDegree[] = (() => {
		if (rest.includes('-') || rest.includes('dim')) {
			return ['flat3'];
		}

		if (rest === 'sus2') {
			return ['2'];
		}

		if (rest === 'sus4' || rest === 'sus') {
			return ['4'];
		}

		return ['3'];
	})();

	const five: ScaleDegree[] = (() => {
		if (rest.includes('dim') || rest.includes('b5')) {
			return ['flat5'];
		}

		if (rest.includes('+')) {
			return ['sharp5'];
		}

		return ['5'];
	})();

	const seven: ScaleDegree[] = (() => {
		if (rest.includes('7') || rest.includes('9') || rest.includes('11') || rest.includes('13')) {
			if (rest.includes('dim')) {
				return ['flatflat7'];
			}
			if (rest.includes('maj')) {
				return ['7'];
			}

			return ['flat7'];
		}

		return [];
	})();

	const nine: ScaleDegree[] = (() => {
		if (rest.includes('9') || rest.includes('11') || rest.includes('13')) {
			return ['2'];
		}

		return [];
	})();

	const eleven: ScaleDegree[] = (() => {
		if (rest.includes('11') || rest.includes('13')) {
			return ['4'];
		}

		return [];
	})();

	const thirteen: ScaleDegree[] = (() => {
		if (rest.includes('13')) {
			return ['6'];
		}

		return [];
	})();

	return new Chord(root, ['1', ...middle, ...five, ...seven, ...nine, ...eleven, ...thirteen]);
};
