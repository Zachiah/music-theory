import { describe, it, expect } from 'vitest';

import { decodeMIDIPitch } from './midi';
import { Pitch } from './Pitch';

describe(decodeMIDIPitch, () => {
	it('should handle pitches', () => {
		const c = (s: string) => Pitch.toCanonical(Pitch.parse(s)!);

		expect(decodeMIDIPitch(0)).toEqual(c('C-1'));
		expect(decodeMIDIPitch(1)).toEqual(c('Db-1'));
		expect(decodeMIDIPitch(2)).toEqual(c('D-1'));

		expect(decodeMIDIPitch(12)).toEqual(c('C0'));
		expect(decodeMIDIPitch(13)).toEqual(c('Db0'));
		expect(decodeMIDIPitch(24)).toEqual(c('C1'));

		expect(decodeMIDIPitch(59)).toEqual(c('B3'));
		expect(decodeMIDIPitch(60)).toEqual(c('C4'));
		expect(decodeMIDIPitch(61)).toEqual(c('Db4'));

		expect(decodeMIDIPitch(69)).toEqual(c('A4'));
		expect(decodeMIDIPitch(72)).toEqual(c('C5'));

		expect(decodeMIDIPitch(127)).toEqual(c('G9'));
	});
});
