import { Interval } from '$lib/Intervals';
import { MusicDisplayOptions } from '$lib/musicDisplayOptions';
import { PitchClass } from '$lib/PitchClass';
import type { Chord } from './chord';
import { ScaleDegree } from './scaleDegree';

export const printChord = (chord: Chord, o: MusicDisplayOptions): string => {
	const y = (s: ScaleDegree) => chord.scaleDegrees.includes(s);
	const n = (s: ScaleDegree) => !y(s);
	const l = [...new Set(chord.scaleDegrees)].length;
	const M = MusicDisplayOptions;

	const baseDiminished = y('flat3') && y('flat5');

	const diminished = baseDiminished && n('flat7');
	const halfDiminished = baseDiminished && y('flat7') && o.halfDiminished === 'ø';
	const major = y('7') && n('flat7');
	const minor = y('flat3') && !diminished && !halfDiminished;
	const flatNineNineCluster = l === 3 && y('flat2') && y('2');

	const normal3: ScaleDegree = minor || diminished || halfDiminished ? 'flat3' : '3';
	const normal7: ScaleDegree = major ? '7' : diminished ? 'flatflat7' : 'flat7';
	const highestNormal: number = (() => {
		if (
			y('6') &&
			n('flat6') &&
			(y('4') || y('sharp4')) &&
			(y('2') || y('flat2') || y('sharp2')) &&
			y(normal7) &&
			y(normal3)
		) {
			return 13;
		}
		if (
			y('4') &&
			n('sharp4') &&
			(y('2') || y('flat2') || y('sharp2')) &&
			y(normal7) &&
			y(normal3)
		) {
			return 11;
		}
		if (y('2') && n('flat2') && n('sharp2') && y(normal7) && y(normal3)) {
			return 9;
		}

		if (
			y(normal7) &&
			!((y('7') && y('flat7')) || (y('7') && y('flatflat7')) || (y('flat7') && y('flatflat7')))
		) {
			return 7;
		}

		return 0;
	})();

	const highestAllPresent = (() => {
		if (y(normal7)) {
			if (y('2') || y('flat2') || y('sharp2')) {
				if (y('4') || y('sharp4')) {
					if (y('6') || y('flat6')) {
						return 13;
					}
					return 11;
				}
				return 9;
			}
			return 7;
		}
		return 0;
	})();

	const mods: [string, boolean][] = (() => {
		if (l === 1) {
			return [[' (unison)', true]];
		}

		if (l === 2) {
			const other = chord.scaleDegrees.find((sd) => sd !== '1');
			if (!other) {
				throw new Error('Cannot find other');
			}

			return [[' ' + Interval.print(ScaleDegree.toInterval(other)), true]];
		}

		return [
			[M.dim(o), diminished],
			['ø', halfDiminished],
			[M.min(o), minor],
			[M.aug(o), y('sharp5') && o.augmented !== '#5'],
			[M.lowerMaj(o), major],
			[`${highestNormal || ''}`, !(highestNormal === 7 && halfDiminished)],
			['6', y('6') && n(normal7)],
			['/9', y('2') && y('6') && n(normal7)],
			[' sus2', y('2') && n(normal3) && n('flat2')],
			[' sus4', y('4') && n(normal3)],
			[` ${M.lowerFlat(o)}5`, y('flat5') && !diminished && !halfDiminished],
			[` ${M.aug(o)}`, y('sharp5') && o.augmented === '#5'],
			[' maj7', y('flat7') && y('7')],
			[` 7`, y('flat7') && y('7')],
			[
				` ${highestAllPresent < 7 ? 'add' : ''}${M.lowerFlat(o)}9`,
				y('flat2') && !flatNineNineCluster,
			],
			[
				` ${highestAllPresent < 7 ? 'add' : ''}9`,
				y('2') &&
					(y('flat2') || y('sharp2') || (highestAllPresent < 7 && y(normal3) && n('6'))) &&
					!flatNineNineCluster,
			],
			[` ${highestAllPresent < 7 ? 'add' : ''}${M.sharp(o)}9`, y('sharp2')],
			[
				` ${highestAllPresent < 9 ? 'add' : ''}11`,
				y('4') && y(normal3) && (y('sharp4') || highestAllPresent < 9),
			],
			[` ${highestAllPresent < 9 ? 'add' : ''}${M.sharp(o)}11`, y('sharp4')],
			[
				` ${highestAllPresent < 11 ? 'add' : ''}${highestAllPresent < 11 ? M.upperFlat(o) : M.lowerFlat(o)}13`,
				y('flat6'),
			],
			[
				` ${highestAllPresent < 11 ? 'add' : ''}13`,
				y(normal7) && y('6') && (y('flat6') || highestNormal < 13),
			],
			[` [${M.lowerFlat(o)}9, 9] cluster`, flatNineNineCluster],
		];
	})();

	const modString = mods
		.filter((m) => m[1])
		.map((m) => m[0])
		.reduce((str, curr) => {
			if (str === '') {
				return curr;
			}

			if (curr === '') {
				return str;
			}

			return str.concat(`${curr[0].toUpperCase()}${curr.slice(1)}`);
		}, '');

	const slashString = (() => {
		const originalRoot = ScaleDegree.getPitchFromRoot(chord.scaleDegrees[0], chord.root);

		if (
			o.slashNotation === false ||
			PitchClass.toCanonicalPitchClass(chord.root) ===
				PitchClass.toCanonicalPitchClass(originalRoot)
		) {
			return '';
		}

		return ` / ${PitchClass.print(originalRoot, o)}`;
	})();

	return `${PitchClass.print(chord.root, o)}${modString}${slashString}`;
};
