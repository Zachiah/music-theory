import { CanonicalPitchClass } from './CanonicalPitchClass';
import { PitchClass } from './PitchClass';
import { PitchConstituents } from './PitchConstituents';
import { modWithNegative } from './util';

export type GuessedChord = {
	root: CanonicalPitchClass;
	originalRoot: CanonicalPitchClass;
	major: boolean;
	minor: boolean;
	diminished: boolean;
	augmented: boolean;
	halfDiminished: boolean;
	sus4: boolean;
	sus2: boolean;
	five: boolean;
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
	flatSix: boolean;
	sixNine: boolean;
	hasThreeish: boolean;
	hasFivish: boolean;
	hasMiddlish: boolean;
	hasFive: boolean;
	hasSevenish: boolean;
	highestDegree: null | number;
};

export namespace GuessedChord {
	export type PrintingOptions = {
		sixNine: boolean;
		six: boolean;
		flats: '♭' | 'b';
		sharps: '♯' | '#';
		major: 'Δ' | 'maj';
		minor: '-' | 'm';
		diminished: '°' | 'dim';
		augmented: '+' | 'aug' | '#5';
		halfDiminished: 'ø' | 'm7b5';
		slashNotation: boolean;
	};

	const normalizeNoteString = (
		pitch: CanonicalPitchClass,
		availableNotes: PitchClass[],
		{
			lowerFlat,
			sharp,
			doubleFlat,
			doubleSharp
		}: { lowerFlat: string; sharp: string; doubleFlat: string; doubleSharp: string }
	) => {
		const found = availableNotes.find((an) => {
			return PitchClass.toCanonicalPitchClass(an) === pitch;
		});

		const normalized = PitchClass.print(found || PitchClass.fromCanonicalPitchClass(pitch))
			.replaceAll('♭', lowerFlat)
			.replaceAll('♯', sharp)
			.replaceAll('𝄫', doubleFlat)
			.replaceAll('𝄪', doubleSharp);

		return normalized;
	};

	export const print = (
		c: GuessedChord,
		options: PrintingOptions,
		providedAvailableNotes: PitchClass[] = []
	) => {
		const lowerFlat = options.flats;
		const upperFlat = options.flats.toUpperCase();
		const doubleFlat = options.flats === '♭' ? '𝄫' : 'bb';
		const sharp = options.sharps;
		const doubleSharp = options.sharps === '♯' ? '𝄪' : '##';
		const six = options.six ? '6' : ' add13';
		const flatSix = options.six ? `${lowerFlat}6` : ' add13';
		const sixNine = options.sixNine ? '6/9' : ' add9 add13';
		const maj = options.major;
		const min = options.minor;
		const dim = options.diminished;
		const aug = options.augmented === '#5' ? '' : options.augmented;
		const sharp5 = options.augmented === '#5' ? `${sharp}5` : '';

		const halfDiminished = (() => {
			if (options.halfDiminished === 'ø') {
				return 'ø';
			}

			return `${min}7 ${lowerFlat}5`;
		})();

		const major = (() => {
			if ((c.minor || c.diminished || c.augmented) && c.major) {
				return `${maj[0].toUpperCase()}${maj.slice(1)}`;
			}

			if (c.major) {
				return maj;
			}

			return '';
		})();

		const availableNotes = (() => {
			if (providedAvailableNotes.length !== 0) {
				return providedAvailableNotes;
			}

			const scale = c.minor ? [2, 1, 2, 2, 1, 2] : [2, 2, 1, 2, 2, 2];

			return scale.reduce(
				(notes, interval) => {
					const last = notes[notes.length - 1];
					const newCanonical = CanonicalPitchClass.applyOffset(
						PitchClass.toCanonicalPitchClass(last),
						interval
					);
					return [
						...notes,
						PitchClass.withLetterName(
							newCanonical,
							PitchConstituents.nextLetter(last.letter, 1),
							'closest'
						)
					];
				},
				[PitchClass.fromCanonicalPitchClass(c.root)]
			);
		})();

		const betterRoot = normalizeNoteString(c.root, availableNotes, {
			lowerFlat,
			sharp,
			doubleFlat,
			doubleSharp
		});
		const betterOriginalRoot = normalizeNoteString(c.originalRoot, availableNotes, {
			lowerFlat,
			sharp,
			doubleFlat,
			doubleSharp
		});

		const baseModifiers = [
			betterRoot,
			c.five ? '5' : '',
			c.augmented ? aug : '',
			c.diminished ? dim : '',
			c.minor ? min : '',
			c.six ? six : '',
			c.sixNine ? sixNine : '',
			c.halfDiminished ? halfDiminished : '',
			major,
			c.highestDegree === null ? '' : c.highestDegree
		].filter((m) => m);

		const additionalModifiers = [
			c.augmented ? sharp5 : '',
			c.flatSix ? flatSix : '',
			c.seven ? '7' : '',
			c.maj7 ? `${maj}7` : '',
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

		const slashModifier =
			options.slashNotation && c.originalRoot !== c.root ? ` / ${betterOriginalRoot}` : ``;

		return `${baseModifiers.join('')}${additionalModifiers.length ? ' ' : ''}${additionalModifiers.join(' ')}${slashModifier}`;
	};

	export const getBigConf = (chord: GuessedChord) => {
		if (chord.hasThreeish && chord.hasFivish) {
			return 1001;
		}
		if (chord.hasThreeish || chord.hasFivish) {
			return 1000;
		}
		return 0;
	};

	export const getComplexity = (chord: GuessedChord) => {
		return [
			chord.major,
			// Chords are implicitly major so we can't count
			// chord.minor,
			// chord.diminished,
			// chord.augmented,
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
			//chord.six,
			chord.flatSix,
			chord.sixNine
		]
			.map<number>((b) => (b ? 1 : 0))
			.reduce((a, b) => a + b, 0);
	};
}

export const guessChordNoInversions = (
	pitches: CanonicalPitchClass[],
	originalRoot = pitches[0]
): GuessedChord => {
	const distanceFromC = CanonicalPitchClass.distanceFromC(pitches[0]);

	const distance = modWithNegative(distanceFromC, CanonicalPitchClass.pitches.length);

	const cpc = [...new Set(pitches.map((p) => CanonicalPitchClass.applyOffset(p, -distance)))];

	const diminished =
		cpc.includes('Eb') &&
		cpc.includes('Gb') &&
		!cpc.includes('E') &&
		!cpc.includes('G') &&
		!cpc.includes('Bb');
	const halfDiminished =
		cpc.length === 4 && cpc.includes('Eb') && cpc.includes('Gb') && cpc.includes('Bb');
	const minor = cpc.includes('Eb') && !cpc.includes('E') && !diminished && !halfDiminished;
	const major = cpc.includes('B') && !cpc.includes('Bb');
	const augmented = cpc.includes('E') && cpc.includes('Ab') && !cpc.includes('G');
	const sus4 = cpc.includes('F') && !cpc.includes('E') && !cpc.includes('Eb');
	const sus2 = cpc.includes('D') && !cpc.includes('E') && !cpc.includes('Eb') && !cpc.includes('F');
	const flat5 =
		cpc.includes('Gb') && !cpc.includes('G') && !diminished && !augmented && !halfDiminished;
	const five = cpc.includes('G') && cpc.length === 2;

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

	const flatSixChordNotes: CanonicalPitchClass[] = ['C', 'E', 'Eb', 'G', 'Ab'];
	const isFlatSixChord =
		!augmented &&
		cpc.every((n) => flatSixChordNotes.includes(n)) &&
		!(cpc.includes('E') && cpc.includes('Eb')) &&
		cpc.includes('Ab');

	const flat13 = hasEleven && cpc.includes('Ab') && !augmented;
	const addFlat13 = !isFlatSixChord && !hasEleven && cpc.includes('Ab') && !augmented;
	const thirteen = flat13 && cpc.includes('A');
	const add13 = !isSixNineChord && !isSixChord && !diminished && !hasEleven && cpc.includes('A');

	const highestDegree = (() => {
		if (isSixNineChord || isSixChord || halfDiminished) {
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

	const hasFivish =
		cpc.includes('G') || augmented || diminished || halfDiminished || (minor && flat5);
	const hasThreeish = cpc.includes('E') || cpc.includes('Eb');
	const hasMiddlish = cpc.includes('E') || cpc.includes('Eb') || sus2 || sus4;
	const hasSevenish = seven || maj7 || (highestDegree || 0) >= 7;

	return {
		root: pitches[0],
		originalRoot,
		major,
		minor,
		diminished,
		halfDiminished,
		augmented,
		sus4,
		sus2,
		highestDegree,
		five,
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
		flatSix: isFlatSixChord,
		hasFive: cpc.includes('G'),
		hasFivish,
		hasThreeish,
		hasMiddlish,
		hasSevenish
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
		.map((p) => guessChordNoInversions(p, pitches[0]));

	const bestRes = allPossible.reduce<{ c: GuessedChord; conf: number; done: boolean }>(
		(best, curr) => {
			if (best.done) {
				return best;
			}

			const currConf = GuessedChord.getBigConf(curr) - GuessedChord.getComplexity(curr);

			const wouldBeDone = curr.hasMiddlish && curr.hasSevenish;

			if (currConf > best.conf) {
				return { c: curr, conf: currConf, done: wouldBeDone };
			}
			return best;
		},
		{ c: allPossible[0], conf: 0, done: false }
	);

	return bestRes.c;
};
