import { describe, it, expect } from 'vitest';

import { decodeMIDIPitch } from './midi';
import { CanonicalPitch } from './CanonicalPitch';

describe(decodeMIDIPitch, () => {
	it('should handle pitches', () => {
		expect(decodeMIDIPitch(0)).toEqual(CanonicalPitch.parse('C-1'));
		expect(decodeMIDIPitch(1)).toEqual(CanonicalPitch.parse('Db-1'));
		expect(decodeMIDIPitch(2)).toEqual(CanonicalPitch.parse('D-1'));

		expect(decodeMIDIPitch(12)).toEqual(CanonicalPitch.parse('C0'));
		expect(decodeMIDIPitch(13)).toEqual(CanonicalPitch.parse('Db0'));
		expect(decodeMIDIPitch(24)).toEqual(CanonicalPitch.parse('C1'));

		expect(decodeMIDIPitch(59)).toEqual(CanonicalPitch.parse('B3'));
		expect(decodeMIDIPitch(60)).toEqual(CanonicalPitch.parse('C4'));
		expect(decodeMIDIPitch(61)).toEqual(CanonicalPitch.parse('Db4'));

		expect(decodeMIDIPitch(69)).toEqual(CanonicalPitch.parse('A4'));
		expect(decodeMIDIPitch(72)).toEqual(CanonicalPitch.parse('C5'));

		expect(decodeMIDIPitch(127)).toEqual(CanonicalPitch.parse('G9'));
	});
});
