import { describe, it, expect } from 'vitest';

import { breakApartArray, modWithNegative } from './util';

describe(modWithNegative, () => {
	it('should handle negative numbers properly', () => {
		expect(modWithNegative(-2, 4)).toBe(2);
		expect(modWithNegative(6, 5)).toBe(1);
		expect(modWithNegative(-5, 4)).toBe(3);
	});
});

describe(breakApartArray, () => {
	it('should work', () => {
		expect(breakApartArray([1, 2, 3, 4, 5, 7, 8, 9, 10], (a, b) => b - a === 1)).toEqual([
			[1, 2, 3, 4, 5],
			[7, 8, 9, 10]
		]);
		expect(breakApartArray([1, 3, 4, 5, 7, 8], (a, b) => b - a === 1)).toEqual([
			[1],
			[3, 4, 5],
			[7, 8]
		]);
	});
});
