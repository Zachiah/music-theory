import { CanonicalPitch } from './CanonicalPitch';

export const KEYBOARD_START: CanonicalPitch = { pitchClass: 'C', octave: 2 };
export const KEYBOARD_LENGTH = 49;
export const KEYBOARD_END = CanonicalPitch.applyOffset(KEYBOARD_START, KEYBOARD_LENGTH - 1);

const KEYBINDS_RAW = [
	['Tab', 'Tab'],
	['1', '!'],
	['q', 'Q'],
	['2', '@'],
	['w', 'W'],
	['e', 'E'],
	['4', '$'],
	['r', 'R'],
	['5', '%'],
	['t', 'T'],
	['6', '^'],
	['y', 'Y'],
	['u', 'U'],
	['8', '*'],
	['i', 'I'],
	['9', '('],
	['o', 'O'],
	['p', 'P'],
	['-', '_'],
	['[', '{'],
	['=', '+'],
	[']', '}'],
	['Backspace', 'Backspace'],
	['\\', '|'],
	['ShiftLeft', 'ShiftLeft'],
	['a', 'A'],
	['z', 'Z'],
	['s', 'S'],
	['x', 'X'],
	['c', 'C'],
	['f', 'F'],
	['v', 'V'],
	['g', 'G'],
	['b', 'B'],
	['h', 'H'],
	['n', 'N'],
	['m', 'M'],
	['k', 'K'],
	[',', '<'],
	['l', 'L'],
	['.', '>'],
	['/', '?'],
	["'", '"'],
	['ShiftRight', 'ShiftRight']
];

export const KEYBINDS = KEYBINDS_RAW.map(([key, shifted], keyIdx) => {
	const canonicalPitch = CanonicalPitch.applyOffset(KEYBOARD_START, keyIdx);

	return { key, shifted, canonicalPitch };
});

export const findPitchForEventByKeybind = (e: KeyboardEvent) => {
	return KEYBINDS.find((k) => {
		if (k.key.includes('Shift')) {
			return k.key === e.code || (k.shifted === e.code && e.shiftKey);
		}
		return k.key === e.key || (k.shifted === e.key && e.shiftKey);
	});
};

export const getFormattedKeybindForPitch = (cp: CanonicalPitch) => {
	const k =
		KEYBINDS.find((k) => CanonicalPitch.equal(k.canonicalPitch, cp))?.key.toUpperCase() || '';

	const betterKeybindName = k
		.replace('SHIFT', '⇧')
		.replace('BACKSPACE', '←')
		.replace('LEFT', '←')
		.replace('RIGHT', '→');

	return betterKeybindName;
};
