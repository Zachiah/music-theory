import { modWithNegative } from './util';

export namespace PitchConstituents {
	export const letterNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G'] as const;
	export type LetterName = (typeof letterNames)[number];

	export const nextLetter = (letter: LetterName, amount: number) => {
		const idx = letterNames.indexOf(letter);

		return letterNames[(idx + amount) % letterNames.length];
	};

	export const letterBasedHeight = (letter: LetterName, octave: number) => {
		const letterHeight = modWithNegative(
			letterNames.indexOf(letter) - letterNames.indexOf('C'),
			letterNames.length
		);
		return letterNames.length * octave + letterHeight;
	};

	export const validateLetterName = (str: string): LetterName | null => {
		if (letterNames.includes(str as LetterName)) {
			return str as LetterName;
		}

		return null;
	};

	const parseModifierCharacter = (str: string): number | null => {
		const s = str.toLowerCase();
		if (s === 'b' || s === '♭') {
			return -1;
		}

		if (s === '#' || s === '♯') {
			return 1;
		}

		if (s === '𝄫') {
			return -2;
		}

		if (s === '𝄪') {
			return 2;
		}

		return null;
	};

	export const parseModifierString = (str: string): number | null => {
		return [...str].reduce<number | null>((acc, char) => {
			const m = parseModifierCharacter(char);

			if (acc === null || m === null) return null;
			return acc + m;
		}, 0);
	};

	export const printModifiers = (modifier: number): string => {
		const m = Math.abs(modifier);

		const doubles = Math.floor(m / 2);
		const single = m % 2;

		const flats = modifier < 0;
		const doubleChar = flats ? '𝄫' : '𝄪';
		const singleChar = flats ? '♭' : '♯';

		return `${doubleChar.repeat(doubles)}${singleChar.repeat(single)}`;
	};
}
