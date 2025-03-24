import { CanonicalPitchClass } from './CanonicalPitchClass';

import { PitchClass } from './PitchClass';
import { Intervals } from './Intervals';

type GuessedChord = {
	major: boolean;
	minor: boolean;
	diminished: boolean;
	augmented: boolean;
	sus4: boolean;
	sus2: boolean;
	flat5: boolean;
	seven: boolean;
	maj7: boolean;
	flat9: boolean;
	nine: boolean;
	sharp9: boolean;
	addFlat9: boolean;
	addSharp9: boolean;
	add9: boolean;
	eleven: boolean;
	sharp11: boolean;
	add11: boolean;
	addSharp11: boolean;
	thirteen: boolean;
	add13: boolean;
	flat13: boolean;
	addFlat13: boolean;
	six: boolean;
	sixNine: boolean;
	highestDegree: null | number;
};

export namespace GuessedChord {
	export type PrintingOptions = {
		sixNine: boolean,
		six: boolean,
		properFlats: boolean,
		properSharps: boolean,
		properDiminished: boolean,
		properAugmented: boolean,
	}

	export const print = (letter: CanonicalPitchClass, c: GuessedChord, options: PrintingOptions) => {
		const major =
			(c.minor || c.diminished || c.augmented) && c.major ? 'Maj' : c.major ? 'maj' : '';

		const lowerFlat = options.properFlats ? '♭' : 'b'
		const upperFlat = options.properFlats ? '♭' : 'B'
		const sharp = options.properSharps ? '♯' : '#'
		const six = options.six ? '6' : ' add13'
		const sixNine = options.sixNine ? '6/9' : ' add9 add13'
		const dim = options.properDiminished ? '°' : 'dim'
		const aug = options.properAugmented ? '+' : 'aug'

		const baseModifiers = [
			letter,
			c.augmented ? aug : '',
			c.diminished ? dim : '',
			c.minor ? 'm' : '',
			c.six ? six : '',
			c.sixNine ? sixNine : '',
			major,
			c.highestDegree === null ? '' : c.highestDegree,
		].filter(m => m)

		const additionalModifiers = [
			c.seven ? '7' : '',
			c.maj7 ? 'maj7' : '',
			c.flat5 ? `${lowerFlat}5` : '',
			c.flat9 ? `${lowerFlat}9` : '',
			c.nine ? '9' : '',
			c.sharp9 ? `${sharp}9` : '',
			c.eleven ? '11' : '',
			c.sharp11 ? `${sharp}11` : '',
			c.flat13 ? `${lowerFlat}13` : '',
			c.thirteen ? '13' : '',
			c.sus2 ? 'sus2' : '',
			c.sus4 ? 'sus4' : '',
			c.addFlat9 ? `add${upperFlat}9` : '',
			c.add9 ? 'add9' : '',
			c.addSharp9 ? `add${sharp}9` : '',
			c.add11 ? 'add11' : '',
			c.addSharp11 ? `add${sharp}11` : '',
			c.addFlat13 ? `add${upperFlat}13` : '',
			c.add13 ? 'add13' : '',
		].filter(m => m)

		return `${baseModifiers.join('')}${additionalModifiers.length ? ' ' : ''}${additionalModifiers.join(' ')}`
	};
}

export const guessChord = (intervals: number[]): GuessedChord => {
	// TODO: Handle inversions. There is some algorithm to guess the start note
	const canonicalPitchClasses = Intervals.getPitches(
		Intervals.createWithSemitones(2, intervals),
		PitchClass.create('C')!
	).map((p) => PitchClass.toCanonical(p));

	const cpc = canonicalPitchClasses;

	const diminished =
		cpc.includes('Eb') &&
		cpc.includes('Gb') &&
		!cpc.includes('E') &&
		!cpc.includes('G') &&
		!cpc.includes('Bb');
	const minor = cpc.includes('Eb') && !cpc.includes('E') && !diminished;
	const major = cpc.includes('B') && !cpc.includes('Bb');
	const augmented = cpc.includes('E') && cpc.includes('Ab') && !cpc.includes('G');
	const sus4 = cpc.includes('F') && !cpc.includes('E') && !cpc.includes('Eb');
	const sus2 = cpc.includes('D') && !cpc.includes('E') && !cpc.includes('Eb') && !cpc.includes('F');
	const flat5 = cpc.includes('Gb') && !cpc.includes('G') && !diminished && !augmented;

	const maj7 = cpc.includes('B') && cpc.includes('Bb')
	const seven = maj7

	const hasSeven = ((diminished && cpc.includes('A')) || cpc.includes('B') || cpc.includes('Bb'))

	const sixNineChordNotes: CanonicalPitchClass[] = ['C', 'D', 'E', 'Eb', 'G', 'A']
	const isSixNineChord = cpc.every(n => sixNineChordNotes.includes(n)) && !(cpc.includes('E') && cpc.includes('Eb')) && cpc.includes('A') && cpc.includes('D')

	const flat9 = hasSeven && cpc.includes('Db');
	const addFlat9 = !isSixNineChord && !hasSeven && cpc.includes('Db');
	const sharp9 = hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const addSharp9 = !isSixNineChord && !hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const nine = (flat9 || sharp9) && cpc.includes('D');
	const add9 = !isSixNineChord && !hasSeven && !sus2 && cpc.includes('D');

	const hasNine = hasSeven && (cpc.includes('D') || cpc.includes('Db') || (cpc.includes('E') && cpc.includes('Eb')))

	const sharp11 = hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented)
	const addSharp11 = !hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented)
	const eleven = sharp11 && cpc.includes('F')
	const add11 = !hasNine && !sus4 && cpc.includes('F');

	const hasEleven = hasNine && (cpc.includes('F') || cpc.includes('Gb'))

	const sixChordNotes: CanonicalPitchClass[] = ['C', 'E', 'Eb', 'G', 'A']
	const isSixChord = cpc.every(n => sixChordNotes.includes(n)) && !(cpc.includes('E') && cpc.includes('Eb')) && cpc.includes('A')

	const flat13 = hasEleven && cpc.includes('G') && cpc.includes('Ab')
	const addFlat13 = !hasEleven && cpc.includes('G') && cpc.includes('Ab')
	const thirteen = flat13 && cpc.includes('A')
	const add13 = !isSixNineChord && !isSixChord && !diminished && !hasEleven && cpc.includes('A');

	const highestDegree = (() => {
		if (isSixNineChord || isSixChord) {
			return null
		}
		if (!add13 && !thirteen && cpc.includes('A') && !diminished) {
			return 13;
		}

		if (!add11 && !eleven && cpc.includes('F') && !sus4) {
			return 11;
		}

		if (!add9 && !nine && cpc.includes('D') && !sus2) {
			return 9;
		}

		if (!seven && (cpc.includes('B') || cpc.includes('Bb') || (diminished && cpc.includes('A')))) {
			return 7;
		}

		return null;
	})();

	return {
		major,
		minor,
		diminished,
		augmented,
		sus4,
		sus2,
		highestDegree,
		flat5,
		seven,
		maj7,
		flat9,
		nine,
		sharp9,
		addFlat9,
		addSharp9,
		add9,
		add11,
		add13,
		eleven,
		addSharp11,
		sharp11,
		flat13,
		addFlat13,
		thirteen,
		sixNine: isSixNineChord,
		six: isSixChord,
	};
};
