export type MusicDisplayOptions = {
	flats: '♭' | 'b';
	sharps: '♯' | '#';
	major: 'Δ' | 'maj';
	minor: '-' | 'm';
	diminished: '°' | 'dim';
	augmented: '+' | 'aug' | '#5';
	halfDiminished: 'ø' | 'm7b5';
	slashNotation: boolean;
};

export namespace MusicDisplayOptions {
	export const defaultOptions: MusicDisplayOptions = {
		flats: '♭',
		sharps: '♯',
		diminished: 'dim',
		augmented: 'aug',
		minor: 'm',
		major: 'maj',
		halfDiminished: 'm7b5',
		slashNotation: true,
	};

	export const lowerFlat = (options: MusicDisplayOptions): string => {
		return options.flats;
	};

	export const upperFlat = (options: MusicDisplayOptions): string => {
		return options.flats.toUpperCase();
	};

	export const doubleFlat = (options: MusicDisplayOptions): string => {
		return options.flats === '♭' ? '𝄫' : 'bb';
	};

	export const sharp = (options: MusicDisplayOptions): string => {
		return options.sharps;
	};

	export const doubleSharp = (options: MusicDisplayOptions): string => {
		return options.sharps === '♯' ? '𝄪' : '##';
	};

	export const lowerMaj = (options: MusicDisplayOptions): string => {
		return options.major;
	};

	export const upperMaj = (options: MusicDisplayOptions): string => {
		const m = lowerMaj(options);
		return `${m[0].toUpperCase()}${m.slice(1)}`;
	};

	export const min = (options: MusicDisplayOptions): string => {
		return options.minor;
	};

	export const dim = (options: MusicDisplayOptions): string => {
		return options.diminished;
	};

	export const aug = (options: MusicDisplayOptions): string => {
		return options.augmented === '#5' ? `${sharp(options)}5` : options.augmented;
	};
}
