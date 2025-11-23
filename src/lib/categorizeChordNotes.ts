import type { CanonicalPitch } from './CanonicalPitch';
import { CanonicalPitchClass } from './CanonicalPitchClass';
import type { GuessedChord } from './guessChord';
import type { Pitch } from './Pitch';
import { PitchClass } from './PitchClass';
import { PitchConstituents } from './PitchConstituents';
import { modWithNegative } from './util';

export type ScaleDegree =
	| '1'
	| 'flat2'
	| '2'
	| 'sharp2'
	| 'flat3'
	| '3'
	| '4'
	| 'sharp4'
	| 'flat5'
	| '5'
	| 'sharp5'
	| 'flat6'
	| '6'
	| 'flatflat7'
	| 'flat7'
	| '7';

export namespace ScaleDegree {
	export const print = (s: ScaleDegree) => {
		const mapping: { [key in ScaleDegree]: string } = {
			'1': 'I',
			flat2: '♭II',
			'2': 'II',
			sharp2: '♯II',
			flat3: '♭III',
			'3': 'III',
			'4': 'IV',
			sharp4: '♯IV',
			flat5: '♭V',
			'5': 'V',
			sharp5: '♯V',
			flat6: '♭VI',
			'6': 'VI',
			flatflat7: '♭♭VII',
			flat7: '♭VII',
			'7': 'VII'
		};

		if (!mapping[s]) {
			throw new Error(`invalid scale degree: ${s}`);
		}

		console.log(mapping[s]);
		return mapping[s];
	};
}

export const categorizeChordNotes = (
	pitches: CanonicalPitchClass[],
	guessedChord: GuessedChord
): ScaleDegree[] => {
	const rootDistance = CanonicalPitchClass.distanceFromC(guessedChord.root);
	return pitches.map<ScaleDegree>((pitch) => {
		const distance = modWithNegative(
			CanonicalPitchClass.distanceFromC(pitch) - rootDistance,
			CanonicalPitchClass.pitches.length
		);

		if (distance === 0) {
			return '1';
		}

		if (distance === 1) {
			return 'flat2';
		}

		if (distance === 2) {
			return '2';
		}

		if (distance === 3) {
			return guessedChord.sharp9 || guessedChord.addSharp9 ? 'sharp2' : 'flat3';
		}

		if (distance === 4) {
			return '3';
		}

		if (distance === 5) {
			return '4';
		}

		if (distance === 6) {
			return guessedChord.sharp11 || guessedChord.addSharp11 ? 'sharp4' : 'flat5';
		}

		if (distance === 7) {
			return '5';
		}

		if (distance === 8) {
			return guessedChord.flat13 || guessedChord.addFlat13 || guessedChord.flatSix
				? 'flat6'
				: 'sharp5';
		}

		if (distance === 9) {
			// TODO: This logic needs bettering
			return guessedChord.diminished ? 'flatflat7' : '6';
		}

		if (distance === 10) {
			return 'flat7';
		}

		if (distance === 11) {
			return '7';
		}

		throw new Error(`Distance was too high: ${distance}`);
	});
};

export const scaleDegreeToPitchClass = (scaleDegree: ScaleDegree, root: PitchClass): PitchClass => {
	const mapping: { [key in ScaleDegree]: { letter: number; halfSteps: number } } = {
		'1': { letter: 1, halfSteps: 1 },
		flat2: { letter: 2, halfSteps: 2 },
		'2': { letter: 2, halfSteps: 3 },
		sharp2: { letter: 2, halfSteps: 4 },
		flat3: { letter: 3, halfSteps: 4 },
		'3': { letter: 3, halfSteps: 5 },
		'4': { letter: 4, halfSteps: 6 },
		sharp4: { letter: 4, halfSteps: 7 },
		flat5: { letter: 5, halfSteps: 7 },
		'5': { letter: 5, halfSteps: 8 },
		sharp5: { letter: 5, halfSteps: 9 },
		flat6: { letter: 6, halfSteps: 9 },
		'6': { letter: 6, halfSteps: 10 },
		flatflat7: { letter: 7, halfSteps: 10 },
		flat7: { letter: 7, halfSteps: 11 },
		'7': { letter: 7, halfSteps: 12 }
	};

	const letter = PitchConstituents.nextLetter(root.letter, mapping[scaleDegree].letter - 1);

	const rh = CanonicalPitchClass.distanceFromC(PitchClass.toCanonicalPitchClass(root));
	const lh = CanonicalPitchClass.distanceFromC(letter);

	const gap = modWithNegative(lh - rh, CanonicalPitchClass.pitches.length);

	const modifier = mapping[scaleDegree].halfSteps - 1 - gap;

	return {
		letter,
		modifier
	};
};

export const getModifiedOctave = (
	originalOctave: number,
	originalPitchClass: PitchClass,
	newPitchClass: PitchClass
): number => {
	if (originalPitchClass.letter === 'C' && newPitchClass.letter === 'B') {
		return originalOctave - 1;
	}

	if (originalPitchClass.letter === 'B' && newPitchClass.letter === 'C') {
		return originalOctave + 1;
	}

	return originalOctave;
};

export const normalizeChordPitchesWithOctaves = (
	pitches: CanonicalPitch[],
	guessedChord: GuessedChord
): { pitch: Pitch; scaleDegree: ScaleDegree }[] => {
	const categorized = categorizeChordNotes(
		pitches.map((p) => p.pitchClass),
		guessedChord
	);

	return categorized.map((c, idx) => {
		const p = scaleDegreeToPitchClass(c, PitchClass.fromCanonicalPitchClass(guessedChord.root));
		const pitch: Pitch = {
			pitchClass: p,
			octave: getModifiedOctave(
				pitches[idx].octave,
				PitchClass.fromCanonicalPitchClass(pitches[idx].pitchClass),
				p
			)
		};

		return { pitch, scaleDegree: c };
	});
};
