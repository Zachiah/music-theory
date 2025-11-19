import { PitchConstituents } from './PitchConstituents';
import { CanonicalPitchClass } from './CanonicalPitchClass';
import { modWithNegative } from './util';

export type PitchClass = {
	letter: PitchConstituents.LetterName;
	modifier: number;
};

export namespace PitchClass {
	export const resolve = (p: PitchClass): CanonicalPitchClass => {
		return CanonicalPitchClass.applyOffset(p.letter, p.modifier);
	};

	export const withLetterName = (
		resolvedPitch: CanonicalPitchClass,
		letterName: PitchConstituents.LetterName,
		direction: 'down' | 'up' | 'closest'
	): PitchClass => {
		const letterNameIdx = CanonicalPitchClass.pitches.indexOf(letterName);
		const resolvedPitchIdx = CanonicalPitchClass.pitches.indexOf(resolvedPitch);

		const offsetPositive = modWithNegative(
			resolvedPitchIdx - letterNameIdx,
			CanonicalPitchClass.pitches.length
		);
		const offsetNegative = offsetPositive === 0 ? 0 : offsetPositive - 12;

		const offset =
			direction === 'down'
				? offsetNegative
				: direction === 'up'
					? offsetPositive
					: Math.abs(offsetNegative) < offsetPositive
						? offsetNegative
						: offsetPositive;

		const pitch = create(`${letterName}${PitchConstituents.printModifiers(offset)}`);
		if (pitch === null) {
			throw new Error('Error creating pitch');
		}

		return pitch;
	};

	export const create = (s: string): PitchClass | null => {
		const sanitized = s
			.replaceAll(/\s/g, '')
			.toUpperCase()
			.replaceAll('FLAT', 'B')
			.replaceAll('SHARP', '#');

		const letter = PitchConstituents.validateLetterName(sanitized[0]);
		const modifier = PitchConstituents.parseModifierString(sanitized.slice(1));

		if (!letter || modifier === null) {
			return null;
		}

		return { letter, modifier };
	};

	export const print = (n: PitchClass) => {
		return `${n.letter}${PitchConstituents.printModifiers(n.modifier)}`;
	};

	export const toCanonicalPitchClass = (p: PitchClass): CanonicalPitchClass => {
		return CanonicalPitchClass.applyOffset(p.letter, p.modifier);
	};

	export const fromCanonicalPitchClass = (p: CanonicalPitchClass): PitchClass => {
		const mapping: { [key in CanonicalPitchClass]: PitchClass } = {
			Ab: { letter: 'A', modifier: -1 },
			A: { letter: 'A', modifier: 0 },
			Bb: { letter: 'B', modifier: -1 },
			B: { letter: 'B', modifier: 0 },
			C: { letter: 'C', modifier: 0 },
			Db: { letter: 'D', modifier: -1 },
			D: { letter: 'D', modifier: 0 },
			Eb: { letter: 'E', modifier: -1 },
			E: { letter: 'E', modifier: 0 },
			F: { letter: 'F', modifier: 0 },
			Gb: { letter: 'G', modifier: -1 },
			G: { letter: 'G', modifier: 0 }
		};

		return mapping[p];
	};
}
