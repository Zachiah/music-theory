import { MusicDisplayOptions } from '$lib/musicDisplayOptions';
import { PitchClass } from '$lib/PitchClass';

export type Chord = {
	root: PitchClass;
	originalRoot: PitchClass;
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

export namespace Chord {
	export const print = (c: Chord, options: MusicDisplayOptions) => {
		const aug = options.augmented === '#5' ? '' : MusicDisplayOptions.aug(options);
		const sharp5 = options.augmented === '#5' ? MusicDisplayOptions.aug(options) : '';

		const halfDiminished = (() => {
			if (options.halfDiminished === 'ø') {
				return 'ø';
			}

			return `${MusicDisplayOptions.min(options)}7 ${MusicDisplayOptions.lowerFlat(options)}5`;
		})();

		const major = (() => {
			if ((c.minor || c.diminished || c.augmented) && c.major) {
				return MusicDisplayOptions.upperMaj(options);
			}

			if (c.major) {
				return MusicDisplayOptions.lowerMaj(options);
			}

			return '';
		})();

		const baseModifiers = [
			PitchClass.print(c.root, options),
			c.five ? '5' : '',
			c.augmented ? aug : '',
			c.diminished ? MusicDisplayOptions.dim(options) : '',
			c.minor ? MusicDisplayOptions.min(options) : '',
			c.six ? MusicDisplayOptions.six(options) : '',
			c.sixNine ? MusicDisplayOptions.sixNine(options) : '',
			c.halfDiminished ? halfDiminished : '',
			major,
			c.highestDegree === null ? '' : c.highestDegree
		].filter((m) => m);

		const additionalModifiers = [
			c.augmented ? sharp5 : '',
			c.flatSix ? MusicDisplayOptions.flatSix(options) : '',
			c.seven ? '7' : '',
			c.maj7 ? `${MusicDisplayOptions.lowerMaj(options)}7` : '',
			c.flat5 ? `${MusicDisplayOptions.lowerFlat(options)}5` : '',
			c.flat9 ? `${MusicDisplayOptions.lowerFlat(options)}9` : '',
			c.nine ? '9' : '',
			c.sharp9 ? `${MusicDisplayOptions.sharp(options)}9` : '',
			c.eleven ? '11' : '',
			c.sharp11 ? `${MusicDisplayOptions.sharp(options)}11` : '',
			c.flat13 ? `${MusicDisplayOptions.lowerFlat(options)}13` : '',
			c.thirteen ? '13' : '',
			c.sus2 ? 'sus2' : '',
			c.sus4 ? 'sus4' : '',
			c.addFlat9 ? `add${MusicDisplayOptions.upperFlat(options)}9` : '',
			c.add9 ? 'add9' : '',
			c.addSharp9 ? `add${MusicDisplayOptions.sharp(options)}9` : '',
			c.add11 ? 'add11' : '',
			c.addSharp11 ? `add${MusicDisplayOptions.sharp(options)}11` : '',
			c.addFlat13 ? `add${MusicDisplayOptions.upperFlat(options)}13` : '',
			c.add13 ? 'add13' : ''
		].filter((m) => m);

		const slashModifier =
			options.slashNotation && c.originalRoot !== c.root
				? ` / ${PitchClass.print(c.originalRoot, options)}`
				: ``;

		return `${baseModifiers.join('')}${additionalModifiers.length ? ' ' : ''}${additionalModifiers.join(' ')}${slashModifier}`;
	};
}
