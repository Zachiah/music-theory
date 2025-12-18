import { Interval } from '$lib/Intervals';
import type { PitchClass } from '$lib/PitchClass';

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

		return mapping[s];
	};

	export const toInterval = (s: ScaleDegree): Interval => {
		const mapping: { [key in ScaleDegree]: Interval } = {
			'1': { letters: 0, semitones: 0 },
			flat2: { letters: 1, semitones: 1 },
			'2': { letters: 1, semitones: 2 },
			sharp2: { letters: 1, semitones: 3 },
			flat3: { letters: 2, semitones: 3 },
			'3': { letters: 2, semitones: 4 },
			'4': { letters: 3, semitones: 5 },
			sharp4: { letters: 3, semitones: 6 },
			flat5: { letters: 4, semitones: 6 },
			'5': { letters: 4, semitones: 7 },
			sharp5: { letters: 4, semitones: 8 },
			flat6: { letters: 5, semitones: 8 },
			'6': { letters: 5, semitones: 9 },
			flatflat7: { letters: 6, semitones: 9 },
			flat7: { letters: 6, semitones: 10 },
			'7': { letters: 6, semitones: 11 }
		};

		if (!mapping[s]) {
			throw new Error(`invalid scale degree: ${s}`);
		}

		return mapping[s];
	};

	export const getPitchFromRoot = (s: ScaleDegree, root: PitchClass): PitchClass => {
		const interval = toInterval(s);

		return Interval.getPitchOffset(interval, root);
	};
}
