import { GuessedChord } from './guessChord';
import { createLocalStorageState } from './localStorageState.svelte';

const convertOld = (old: { version: number; value: unknown }): GuessedChord.PrintingOptions => {
	if (old.version === 1) {
		return convertOld({ version: 2, value: { ...(old.value as object), slashNotation: true } });
	}

	if (old.version === 2) {
		return old.value as GuessedChord.PrintingOptions;
	}

	return defaults;
};

const defaults = {
	six: true,
	sixNine: true,
	properFlats: true,
	properSharps: true,
	properDiminished: true,
	properAugmented: true,
	slashNotation: true
};

export const printingOptions = createLocalStorageState<GuessedChord.PrintingOptions>(
	'printingOptions',
	2,
	defaults,
	convertOld
);
