import { GuessedChord } from './guessChord';
import { createLocalStorageState } from './localStorageState.svelte';

type PrintingOptionsV1 = {
	sixNine: boolean;
	six: boolean;
	properFlats: boolean;
	properSharps: boolean;
	properDiminished: boolean;
	properAugmented: boolean;
};

type PrintingOptionsV2 = {
	sixNine: boolean;
	six: boolean;
	properFlats: boolean;
	properSharps: boolean;
	properDiminished: boolean;
	properAugmented: boolean;
	slashNotation: boolean;
};

const convertOld = (old: { version: number; value: unknown }): GuessedChord.PrintingOptions => {
	if (old.version === 1) {
		const v = old.value as PrintingOptionsV1;

		const o: PrintingOptionsV2 = {
			...v,
			slashNotation: true
		};

		return convertOld({ version: 2, value: o });
	}

	if (old.version === 2) {
		const v = old.value as PrintingOptionsV2;

		const o: GuessedChord.PrintingOptions = {
			sixNine: v.sixNine,
			six: v.six,
			flats: v.properFlats ? '♭' : 'b',
			sharps: v.properSharps ? '♯' : '#',
			major: 'maj',
			minor: 'm',
			diminished: v.properDiminished ? '°' : 'dim',
			augmented: v.properAugmented ? '+' : 'aug',
			halfDiminished: 'ø',
			slashNotation: v.slashNotation
		};

		return convertOld({ version: 3, value: o });
	}

	if (old.version === 3) {
		return old.value as GuessedChord.PrintingOptions;
	}

	return defaults;
};

const defaults: GuessedChord.PrintingOptions = {
	six: true,
	sixNine: true,
	flats: '♭',
	sharps: '♯',
	diminished: 'dim',
	augmented: 'aug',
	minor: 'm',
	major: 'maj',
	halfDiminished: 'half-dim',
	slashNotation: true
};

export const printingOptions = createLocalStorageState<GuessedChord.PrintingOptions>(
	'printingOptions',
	3,
	defaults,
	convertOld
);
