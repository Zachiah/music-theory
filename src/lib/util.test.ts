import { describe, it, expect } from 'vitest';

import { modWithNegative } from './util';

describe(modWithNegative, () => {
	it('should handle negative numbers properly', () => {
		expect(modWithNegative(-2, 4)).toBe(2);
		expect(modWithNegative(6, 5)).toBe(1);
		expect(modWithNegative(-5, 4)).toBe(3);
	});
});
