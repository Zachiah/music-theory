import { CanonicalPitchClass } from './CanonicalPitchClass';
import { modWithNegative } from './util';

export type GuessedChord = {
	root: CanonicalPitchClass;
	confidence: number;
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
		sixNine: boolean;
		six: boolean;
		properFlats: boolean;
		properSharps: boolean;
		properDiminished: boolean;
		properAugmented: boolean;
	};

	export const print = (c: GuessedChord, options: PrintingOptions) => {
		const major =
			(c.minor || c.diminished || c.augmented) && c.major ? 'Maj' : c.major ? 'maj' : '';

		const lowerFlat = options.properFlats ? '♭' : 'b';
		const upperFlat = options.properFlats ? '♭' : 'B';
		const sharp = options.properSharps ? '♯' : '#';
		const six = options.six ? '6' : ' add13';
		const sixNine = options.sixNine ? '6/9' : ' add9 add13';
		const dim = options.properDiminished ? '°' : 'dim';
		const aug = options.properAugmented ? '+' : 'aug';

		const baseModifiers = [
			c.root,
			c.augmented ? aug : '',
			c.diminished ? dim : '',
			c.minor ? 'm' : '',
			c.six ? six : '',
			c.sixNine ? sixNine : '',
			major,
			c.highestDegree === null ? '' : c.highestDegree
		].filter((m) => m);

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
			c.add13 ? 'add13' : ''
		].filter((m) => m);

		return `${baseModifiers.join('')}${additionalModifiers.length ? ' ' : ''}${additionalModifiers.join(' ')}`;
	};

	export const getComplexity = (chord: GuessedChord) => {
		return [
			chord.major,
			chord.minor,
			chord.diminished,
			chord.augmented,
			chord.sus4,
			chord.sus2,
			chord.flat5,
			chord.seven,
			chord.maj7,
			chord.flat9,
			chord.nine,
			chord.sharp9,
			chord.addFlat9,
			chord.addSharp9,
			chord.add9,
			chord.eleven,
			chord.sharp11,
			chord.add11,
			chord.addSharp11,
			chord.thirteen,
			chord.add13,
			chord.flat13,
			chord.addFlat13,
			chord.six,
			chord.sixNine
		]
			.map<number>((b) => (b ? 1 : 0))
			.reduce((a, b) => a + b, 0);
	};
}

export const guessChordNoInversions = (pitches: CanonicalPitchClass[]): GuessedChord => {
	const distanceFromStart = CanonicalPitchClass.pitches.indexOf(pitches[0]);
	const cDistanceFromStart = CanonicalPitchClass.pitches.indexOf('C');

	const distance = modWithNegative(
		distanceFromStart - cDistanceFromStart,
		CanonicalPitchClass.pitches.length
	);

	const cpc = pitches.map((p) => CanonicalPitchClass.applyOffset(p, -distance));

	console.log(pitches[0], distance, cpc);

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

	const maj7 = cpc.includes('B') && cpc.includes('Bb');
	const seven = maj7;

	const hasSeven = (diminished && cpc.includes('A')) || cpc.includes('B') || cpc.includes('Bb');

	const sixNineChordNotes: CanonicalPitchClass[] = ['C', 'D', 'E', 'Eb', 'G', 'A'];
	const isSixNineChord =
		cpc.every((n) => sixNineChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('A') &&
		cpc.includes('D');

	const flat9 = hasSeven && cpc.includes('Db');
	const addFlat9 = !isSixNineChord && !hasSeven && cpc.includes('Db');
	const sharp9 = hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const addSharp9 = !isSixNineChord && !hasSeven && cpc.includes('Eb') && cpc.includes('E');
	const nine = (flat9 || sharp9) && cpc.includes('D');
	const add9 = !isSixNineChord && !hasSeven && !sus2 && cpc.includes('D');

	const hasNine =
		hasSeven &&
		(cpc.includes('D') || cpc.includes('Db') || (cpc.includes('E') && cpc.includes('Eb')));

	const sharp11 = hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented);
	const addSharp11 = !hasNine && cpc.includes('Gb') && (cpc.includes('G') || augmented);
	const eleven = sharp11 && cpc.includes('F');
	const add11 = !hasNine && !sus4 && cpc.includes('F');

	const hasEleven = hasNine && (cpc.includes('F') || cpc.includes('Gb'));

	const sixChordNotes: CanonicalPitchClass[] = ['C', 'E', 'Eb', 'G', 'A'];
	const isSixChord =
		cpc.every((n) => sixChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('A');

	const flat13 = hasEleven && cpc.includes('Ab') && !augmented;
	const addFlat13 = !hasEleven && cpc.includes('Ab') && !augmented;
	const thirteen = flat13 && cpc.includes('A');
	const add13 = !isSixNineChord && !isSixChord && !diminished && !hasEleven && cpc.includes('A');

	const highestDegree = (() => {
		if (isSixNineChord || isSixChord) {
			return null;
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

	let c = cpc.includes('G') || augmented || diminished || (minor && flat5) ? 2 : 0;
	if (c) {
		c += cpc.includes('E') || cpc.includes('Eb') || sus2 || sus4 ? 2 : 0;
	}

	return {
		root: pitches[0],
		confidence: c,
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
		six: isSixChord
	};
};

export const guessChord = (pitches: CanonicalPitchClass[]): GuessedChord => {
	const rotate = <T>(by: number, arr: T[]): T[] => {
		if (by === 0) {
			return arr;
		}

		return rotate(by - 1, arr.slice(1).concat(arr[0]));
	};

	const allPossible = pitches
		.map((_, idx) => rotate(idx, pitches))
		.map((p) => guessChordNoInversions(p));

	// const firstConf = allPossible[0].confidence
	const firstConf = allPossible[0].confidence * 1001 - GuessedChord.getComplexity(allPossible[0]);
	const bestRes = allPossible.reduce<{ c: GuessedChord; conf: number }>(
		(best, curr) => {
			// const currConf = curr.confidence
			const currConf = curr.confidence * 1000 - GuessedChord.getComplexity(curr);

			if (currConf > best.conf) {
				return { c: curr, conf: currConf };
			}
			return best;
		},
		{ c: allPossible[0], conf: firstConf + 1 }
	);

	return bestRes.c;
};
