import type { CanonicalPitch } from '$lib/CanonicalPitch';
import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
import type { Pitch } from '$lib/Pitch';
import { PitchClass } from '$lib/PitchClass';
import { modWithNegative } from '$lib/util';
import { ScaleDegree } from './scaleDegree';

export class Chord {
	constructor(
		public root: PitchClass,
		public scaleDegrees: ScaleDegree[],
	) {}

	static guessFromPitchesWithRoot(root: PitchClass, pitches: CanonicalPitchClass[]): Chord {
		const rootCDistance = CanonicalPitchClass.distanceFromC(PitchClass.toCanonicalPitchClass(root));

		const halfSteps = pitches.map((p) => {
			const pCDistance = CanonicalPitchClass.distanceFromC(p);

			return modWithNegative(pCDistance - rootCDistance, CanonicalPitchClass.pitches.length);
		});

		const l = [...new Set(pitches)].length;

		return new Chord(
			root,
			halfSteps.map((h) => this.halfStepToScaleDegree(h, halfSteps, l)),
		);
	}

	static guessFromPitches(pitches: CanonicalPitchClass[]): Chord {
		const possible = pitches.map((p) =>
			this.guessFromPitchesWithRoot(PitchClass.fromCanonicalPitchClass(p), pitches),
		);

		const res = possible.reduce((a, b) => {
			if (b.getComplexity(b === possible[0]) < a.getComplexity(a === possible[0])) {
				return b;
			}

			return a;
		});

		return res;
	}

	public static halfStepToScaleDegree(
		h: number,
		halfSteps: number[],
		uniquePitchCount: number,
	): ScaleDegree {
		if (h === 0) return '1';
		if (h === 1) return 'flat2';
		if (h === 2) return '2';
		if (h === 3) {
			if (
				!halfSteps.includes(4) ||
				(halfSteps.includes(2) && !halfSteps.includes(10) && !halfSteps.includes(11))
			) {
				return 'flat3';
			}

			return 'sharp2';
		}
		if (h === 4) return '3';
		if (h === 5) return '4';
		if (h === 6) {
			return halfSteps.includes(7) || halfSteps.includes(8) ? 'sharp4' : 'flat5';
		}
		if (h === 7) return '5';
		if (h === 8) {
			return halfSteps.includes(7) || uniquePitchCount === 2 ? 'flat6' : 'sharp5';
		}
		if (h === 9) {
			if (
				halfSteps.includes(3) &&
				halfSteps.includes(6) &&
				!halfSteps.includes(7) &&
				!halfSteps.includes(4) &&
				!halfSteps.includes(10) &&
				!halfSteps.includes(11)
			) {
				return 'flatflat7';
			}
			return '6';
		}
		if (h === 10) return 'flat7';
		if (h === 11) return '7';
		throw new Error('Should never hit this');
	}

	private getComplexity(root: boolean): number {
		const s = ScaleDegree.sort([...new Set(this.scaleDegrees)]);

		if (s.length <= 2) {
			return 0;
		}

		if (
			root &&
			s.every(
				(sd, i, arr) =>
					i === 0 ||
					ScaleDegree.toInterval(arr[i - 1]).semitones + 1 === ScaleDegree.toInterval(sd).semitones,
			)
		) {
			return -30000;
		}

		return (
			s.map((sd) => this.getScaleDegreeComplexity(sd)).reduce((a, b) => a + b, 0) -
			this.hasShellAtAll() * 10000 -
			(this.scaleDegrees.length === 2 && this.hasFiveAtAll() ? 10000 : 0)
		);
	}

	private hasShellAtAll(): number {
		const hasFivish =
			this.scaleDegrees.includes('5') ||
			this.scaleDegrees.includes('flat5') ||
			this.scaleDegrees.includes('sharp5');

		const hasSevenish =
			this.scaleDegrees.includes('flatflat7') ||
			this.scaleDegrees.includes('flat7') ||
			this.scaleDegrees.includes('7');

		const hasThreeish = this.scaleDegrees.includes('flat3') || this.scaleDegrees.includes('3');

		const isSus =
			(this.scaleDegrees.includes('2') || this.scaleDegrees.includes('4')) &&
			!(this.scaleDegrees.includes('2') && this.scaleDegrees.includes('4'));

		const hasMiddle = hasThreeish || isSus;

		if ((hasFivish || (hasSevenish && hasThreeish)) && hasMiddle) {
			return 1;
		}

		return 0;
	}

	private hasFiveAtAll(): boolean {
		return (
			this.scaleDegrees.includes('5') ||
			this.scaleDegrees.includes('flat5') ||
			this.scaleDegrees.includes('sharp5')
		);
	}

	private getScaleDegreeComplexity(s: ScaleDegree): number {
		if (s === '1') {
			return 0;
		}

		if (s === '3' || (s === 'flat3' && !this.scaleDegrees.includes('3'))) {
			return 0;
		}

		if (s === '5' || s === 'flat5' || (this.scaleDegrees.includes('3') && s === 'sharp5')) {
			return 0;
		}

		if (
			(s === '7' &&
				!this.scaleDegrees.includes('flat7') &&
				!this.scaleDegrees.includes('flatflat7')) ||
			(s === 'flat7' &&
				!this.scaleDegrees.includes('7') &&
				!this.scaleDegrees.includes('flatflat7')) ||
			(s === 'flatflat7' &&
				!this.scaleDegrees.includes('7') &&
				!this.scaleDegrees.includes('flat7'))
		) {
			return 0;
		}

		if (
			(s === '6' || s === '2') &&
			!this.scaleDegrees.includes('7') &&
			!this.scaleDegrees.includes('flat7') &&
			(this.scaleDegrees.includes('3') || this.scaleDegrees.includes('flat3')) &&
			!this.scaleDegrees.includes('sharp5') &&
			!this.scaleDegrees.includes('flat5')
		) {
			return 0;
		}

		if (
			(s === '2' || s === '4') &&
			!this.scaleDegrees.includes('3') &&
			!this.scaleDegrees.includes('flat3') &&
			!this.scaleDegrees.includes('sharp5') &&
			!this.scaleDegrees.includes('flat5') &&
			!(this.scaleDegrees.includes('2') && this.scaleDegrees.includes('4'))
		) {
			return 0;
		}

		if (
			(s === '2' || s === 'sharp2' || s === 'flat2') &&
			(this.scaleDegrees.includes('7') ||
				this.scaleDegrees.includes('flat7') ||
				this.scaleDegrees.includes('flatflat7')) &&
			!this.scaleDegrees.includes('sharp5') &&
			!this.scaleDegrees.includes('flat5')
		) {
			return 0;
		}

		if (
			(s === '4' || s === 'sharp4') &&
			(this.scaleDegrees.includes('7') ||
				this.scaleDegrees.includes('flat7') ||
				this.scaleDegrees.includes('flatflat7'))
		) {
			return 0;
		}

		if (
			(s === '6' || s === 'flat6') &&
			(this.scaleDegrees.includes('7') ||
				this.scaleDegrees.includes('flat7') ||
				this.scaleDegrees.includes('flatflat7'))
		) {
			return 0;
		}

		return 1000;
	}

	private static getModifiedOctave(
		originalOctave: number,
		originalPitchClass: PitchClass,
		newPitchClass: PitchClass,
	): number {
		if (originalPitchClass.letter === 'C' && newPitchClass.letter === 'B') {
			return originalOctave - 1;
		}

		if (originalPitchClass.letter === 'B' && newPitchClass.letter === 'C') {
			return originalOctave + 1;
		}

		return originalOctave;
	}

	getPitchesFromOctave(startOctave: number): Pitch[] {
		let currentOctave = startOctave;
		let previousDistance: number | null = null;

		return this.scaleDegrees.map((scaleDegree) => {
			const pitchClass = ScaleDegree.getPitchFromRoot(scaleDegree, this.root);
			const distance = CanonicalPitchClass.distanceFromC(pitchClass.letter);

			if (previousDistance !== null && distance < previousDistance) {
				currentOctave += 1;
			}

			previousDistance = distance;

			return {
				pitchClass,
				octave: currentOctave,
			};
		});
	}

	getNormalizedPitchesWithOctaves(
		pitches: CanonicalPitch[],
	): { pitch: Pitch; scaleDegree: ScaleDegree }[] {
		return this.scaleDegrees.map((c, idx) => {
			const p = ScaleDegree.getPitchFromRoot(c, this.root);

			const pitch: Pitch = {
				pitchClass: p,
				octave: Chord.getModifiedOctave(
					pitches[idx].octave,
					PitchClass.fromCanonicalPitchClass(pitches[idx].pitchClass),
					p,
				),
			};

			return { pitch, scaleDegree: c };
		});
	}
}
