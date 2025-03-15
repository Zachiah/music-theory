import { describe, it, expect } from 'vitest';

import { PitchConstituents } from './PitchConstituents';

describe('PitchConstituents', () => {
	it('Should properly generate modifiers', () => {
		expect(PitchConstituents.printModifiers(4)).toBe('𝄪𝄪');
		expect(PitchConstituents.printModifiers(-4)).toBe('𝄫𝄫');
		expect(PitchConstituents.printModifiers(-3)).toBe('𝄫♭');
		expect(PitchConstituents.printModifiers(3)).toBe('𝄪♯');
		expect(PitchConstituents.printModifiers(0)).toBe('');
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
