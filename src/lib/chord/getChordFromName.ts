import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import { PitchClass } from '$lib/PitchClass';
import { minByIndex, modWithNegative, rotateArray } from '$lib/util';
import { Chord } from './chord';
import { ScaleDegree } from './scaleDegree';
import * as TSP from 'typescript-parsec';

enum TokenKind {
	PitchClass,
	Slash,
	Space,
	Minor,
	Major,
	Augmented,
	Diminished,
	Sus2,
	Sus4,
	Degree,
	FlatDegree,
	SharpDegree,
	Add,
}

const lexer = TSP.buildLexer([
	[true, /^[A-Ga-g][b♭𝄫#♯𝄪]*/gu, TokenKind.PitchClass],
	[true, /^\//g, TokenKind.Slash],
	[true, /^[-m]/g, TokenKind.Minor],
	[true, /^(maj|Δ)/g, TokenKind.Major],
	[true, /^(aug|\+)/g, TokenKind.Augmented],
	[true, /^(dim|°)/g, TokenKind.Diminished],
	[true, /^sus2/g, TokenKind.Sus2],
	[true, /^sus4?/g, TokenKind.Sus4],
	[true, /^(2|5|6|7|9|11|13)/g, TokenKind.Degree],
	[true, /^[b♭](2|5|6|7|9|11|13)/g, TokenKind.FlatDegree],
	[true, /^[#♯](2|5|6|7|9|11|13)/g, TokenKind.SharpDegree],
	[true, /^add/g, TokenKind.Add],
	[false, /^\s+/g, TokenKind.Space],
]);

const PITCH_CLASS = TSP.rule<TokenKind, PitchClass>();
PITCH_CLASS.setPattern(
	TSP.apply(TSP.tok(TokenKind.PitchClass), (ptc) => {
		return PitchClass.create(ptc.text)!;
	}),
);

type BaseType = '-' | '+' | 'dim' | 'sus2' | 'sus4' | '-+';

const BASE_TYPE = TSP.rule<TokenKind, BaseType>();
BASE_TYPE.setPattern(
	TSP.alt(
		TSP.apply(TSP.seq(TSP.tok(TokenKind.Minor), TSP.tok(TokenKind.Augmented)), () => '-+'),
		TSP.apply(TSP.tok(TokenKind.Minor), () => '-' as const),
		TSP.apply(TSP.tok(TokenKind.Augmented), () => '+' as const),
		TSP.apply(TSP.tok(TokenKind.Diminished), () => 'dim' as const),
		TSP.apply(TSP.tok(TokenKind.Sus2), () => 'sus2' as const),
		TSP.apply(TSP.str('2'), () => 'sus2' as const),
		TSP.apply(TSP.tok(TokenKind.Sus4), () => 'sus4' as const),
	),
);

type HighestNormalDegree = { maj: boolean; highestDegree: number };
const HIGHEST_NORMAL_DEGREE = TSP.rule<TokenKind, HighestNormalDegree>();
HIGHEST_NORMAL_DEGREE.setPattern(
	TSP.apply(TSP.seq(TSP.opt(TSP.tok(TokenKind.Major)), TSP.tok(TokenKind.Degree)), (v) => ({
		maj: v[0] !== undefined,
		highestDegree: +v[1].text,
	})),
);

type Modifications = string[];
const MODIFICATIONS = TSP.rule<TokenKind, Modifications>();
MODIFICATIONS.setPattern(
	TSP.apply(
		TSP.rep(
			TSP.seq(
				TSP.opt(TSP.tok(TokenKind.Add)),
				TSP.alt(
					TSP.tok(TokenKind.Degree),
					TSP.tok(TokenKind.FlatDegree),
					TSP.tok(TokenKind.SharpDegree),
					TSP.apply(TSP.seq(TSP.tok(TokenKind.Major), TSP.str('7')), () => ({ text: 'maj7' })),
				),
			),
		),
		(items) =>
			items.map(
				([add, item]) =>
					`${add ? 'add' : ''}${item.text.replaceAll('♭', 'b').replaceAll('♯', '#')}`,
			),
	),
);

const SLASH_NOTATION = TSP.rule<TokenKind, PitchClass>();
SLASH_NOTATION.setPattern(TSP.kright(TSP.tok(TokenKind.Slash), PITCH_CLASS));

const EXP = TSP.rule<TokenKind, Chord>();
EXP.setPattern(
	TSP.apply(
		TSP.seq(
			PITCH_CLASS,
			TSP.opt_sc(BASE_TYPE),
			TSP.opt_sc(HIGHEST_NORMAL_DEGREE),
			MODIFICATIONS,
			TSP.opt(SLASH_NOTATION),
		),
		([root, baseType, highestNormalDeg, mods, over]) => {
			const overHalfSteps = (() => {
				if (!over) {
					return null;
				}

				const rootCanonical = PitchClass.toCanonicalPitchClass(root);
				const overCanonical = PitchClass.toCanonicalPitchClass(over);

				const rootDist = CanonicalPitchClass.distanceFromC(rootCanonical);
				const overDist = CanonicalPitchClass.distanceFromC(overCanonical);

				const halfStepsAboveRoot = modWithNegative(
					overDist - rootDist,
					CanonicalPitchClass.pitches.length,
				);

				return halfStepsAboveRoot;
			})();

			const baseScaleDegrees = getBaseDegrees(baseType, highestNormalDeg, mods);

			if (overHalfSteps === null) {
				return new Chord(root, baseScaleDegrees);
			}

			const foundExistingIndex = baseScaleDegrees.findIndex((sd) => {
				return ScaleDegree.toInterval(sd).semitones === overHalfSteps;
			});

			if (foundExistingIndex !== -1) {
				return new Chord(root, rotateArray(baseScaleDegrees, foundExistingIndex));
			}

			const overScaleDegree = Chord.halfStepToScaleDegree(
				overHalfSteps,
				baseScaleDegrees.map((s) => ScaleDegree.toInterval(s).semitones),
				baseScaleDegrees.length,
			);

			const closestExistingIndex = minByIndex(baseScaleDegrees, (sd) => {
				return modWithNegative(
					ScaleDegree.toInterval(sd).semitones - ScaleDegree.toInterval(overScaleDegree).semitones,
					CanonicalPitchClass.pitches.length,
				);
			});

			return new Chord(root, [
				overScaleDegree,
				...rotateArray(baseScaleDegrees, closestExistingIndex),
			]);
		},
	),
);

const parse = (expr: string) => {
	return TSP.expectSingleResult(TSP.expectEOF(EXP.parse(lexer.parse(expr))));
};

export const getChordFromName = (name: string): Chord | null => {
	try {
		return parse(name);
	} catch (e) {
		console.log(e);
		return null;
	}
};

const getBaseDegrees = (
	baseType: BaseType | undefined,
	highestNormalDegree: HighestNormalDegree | undefined,
	mods: Modifications,
): ScaleDegree[] => {
	const middle: ScaleDegree[] = (() => {
		if (baseType === '-' || baseType === 'dim' || baseType === '-+') {
			return ['flat3'];
		}

		if (baseType === 'sus2') {
			return ['2'];
		}

		if (baseType === 'sus4') {
			return ['4'];
		}

		return ['3'];
	})();

	const five: ScaleDegree[] = (() => {
		if (baseType === 'dim' || mods.includes('b5')) {
			if (baseType === '+' || mods.includes('#5')) {
				throw new Error('Cannot have a flat and sharp 5');
			}

			return ['flat5'];
		}

		if (baseType === '+' || mods.includes('#5')) {
			return ['sharp5'];
		}

		return ['5'];
	})();

	const seven: ScaleDegree[] = (() => {
		const res: ScaleDegree[] = [];

		const defaultSeven: ScaleDegree = (() => {
			if (highestNormalDegree?.maj) {
				return '7';
			}

			if (baseType === 'dim') {
				return 'flatflat7';
			}

			return 'flat7';
		})();

		if ((highestNormalDegree?.highestDegree || 0) === 7) {
			res.push(defaultSeven);
		}

		if (
			(highestNormalDegree?.highestDegree || 0) > 7 &&
			!mods.includes('7') &&
			!mods.includes('maj7')
		) {
			res.push(defaultSeven);
		}

		if (mods.includes('7')) {
			res.push('flat7');
		}

		if (mods.includes('maj7')) {
			res.push('7');
		}

		return res;
	})();

	const nine: ScaleDegree[] = (() => {
		const res: ScaleDegree[] = [];

		const h = highestNormalDegree?.highestDegree || 0;

		if (h === 9) {
			res.push('2');
		}

		if (h > 9 && !mods.includes('9') && !mods.includes('b9') && !mods.includes('#9')) {
			res.push('2');
		}

		if (mods.includes('b9') || mods.includes('addb9')) {
			res.push('flat2');
		}

		if (mods.includes('9') || mods.includes('add9')) {
			res.push('2');
		}

		if (mods.includes('#9') || mods.includes('add#9')) {
			res.push('sharp2');
		}

		return res;
	})();

	const eleven: ScaleDegree[] = (() => {
		const res: ScaleDegree[] = [];

		if ((highestNormalDegree?.highestDegree || 0) === 11) {
			res.push('4');
		}

		if (
			(highestNormalDegree?.highestDegree || 0) > 11 &&
			!mods.includes('11') &&
			!mods.includes('#11')
		) {
			res.push('4');
		}

		if (mods.includes('11') || mods.includes('add11')) {
			res.push('4');
		}

		if (mods.includes('#11') || mods.includes('add#11')) {
			res.push('sharp4');
		}

		return res;
	})();

	const thirteen: ScaleDegree[] = (() => {
		const res: ScaleDegree[] = [];

		const h = highestNormalDegree?.highestDegree || 0;
		if (h === 13 || h === 6) {
			res.push('6');
		}

		if (h > 13 && !mods.includes('13') && !mods.includes('b13')) {
			res.push('6');
		}

		if (mods.includes('b13') || mods.includes('addb13')) {
			res.push('flat6');
		}

		if (mods.includes('13') || mods.includes('add13')) {
			res.push('6');
		}

		return res;
	})();

	return ['1', ...middle, ...five, ...seven, ...nine, ...eleven, ...thirteen];
};
