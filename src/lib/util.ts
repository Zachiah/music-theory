export const modWithNegative = (a: number, b: number): number => {
	if (a >= 0) {
		return a % b;
	}

	return modWithNegative(a + b, b);
};
