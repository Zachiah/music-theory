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
		const sanitized = s.replaceAll(/\s/g, '').toUpperCase();

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

	export const toCanonical = (p: PitchClass) => {
		return CanonicalPitchClass.applyOffset(p.letter, p.modifier);
	};
}
