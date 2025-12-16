import { createLocalStorageState } from '$lib/localStorageState.svelte';
import { MusicDisplayOptions } from './musicDisplayOptions';

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

const convertOld = (old: { version: number; value: unknown }): MusicDisplayOptions => {
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

		const o: MusicDisplayOptions = {
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
		return old.value as MusicDisplayOptions;
	}

	return MusicDisplayOptions.defaultOptions;
};

export const musicDisplayOptions = createLocalStorageState<MusicDisplayOptions>(
	'printingOptions',
	3,
	MusicDisplayOptions.defaultOptions,
	convertOld
);
