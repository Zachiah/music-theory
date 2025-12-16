import { describe, it, expect } from 'vitest';

import { PitchConstituents } from './PitchConstituents';
import { MusicDisplayOptions } from './musicDisplayOptions';

describe('PitchConstituents', () => {
	it('Should properly generate modifiers', () => {
		const options = MusicDisplayOptions.defaultOptions;
		expect(PitchConstituents.printModifiers(4, options)).toBe('𝄪𝄪');
		expect(PitchConstituents.printModifiers(-4, options)).toBe('𝄫𝄫');
		expect(PitchConstituents.printModifiers(-3, options)).toBe('𝄫♭');
		expect(PitchConstituents.printModifiers(3, options)).toBe('𝄪♯');
		expect(PitchConstituents.printModifiers(0, options)).toBe('');

		const otherOptions: MusicDisplayOptions = {
			...MusicDisplayOptions.defaultOptions,
			flats: 'b',
			sharps: '#'
		};
		expect(PitchConstituents.printModifiers(4, otherOptions)).toBe('####');
		expect(PitchConstituents.printModifiers(-4, otherOptions)).toBe('bbbb');
		expect(PitchConstituents.printModifiers(-3, otherOptions)).toBe('bbb');
		expect(PitchConstituents.printModifiers(3, otherOptions)).toBe('###');
		expect(PitchConstituents.printModifiers(0, otherOptions)).toBe('');
	});

	it('Should properly parse modifier strings', () => {
		expect(PitchConstituents.parseModifierString('')).toBe(0);
		expect(PitchConstituents.parseModifierString('bb')).toBe(-2);
		expect(PitchConstituents.parseModifierString('##')).toBe(2);
		expect(PitchConstituents.parseModifierString('𝄪𝄪')).toBe(4);
		expect(PitchConstituents.parseModifierString('𝄫𝄫')).toBe(-4);
		expect(PitchConstituents.parseModifierString('b𝄫b♭♯𝄪')).toBe(-2);
	});
});
