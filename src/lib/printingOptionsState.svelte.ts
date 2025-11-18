import type { GuessedChord } from './guessChord';
import { createLocalStorageState } from './localStorageState.svelte';

export const printingOptions = createLocalStorageState<GuessedChord.PrintingOptions>(
	'printingOptions',
	1,
	{
		six: true,
		sixNine: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	}
);
