export const modWithNegative = (a: number, b: number, supportNaN = false): number => {
	if (isNaN(a) || isNaN(b)) {
		if (supportNaN) {
			return NaN;
		} else {
			throw new Error(`One was NaN: ${a}, ${b}`);
		}
	}
	if (a >= 0) {
		return a % b;
	}

	return modWithNegative(a + b, b);
};

export const rotateArray = <T>(arr: T[], amount: number): T[] => {
	const actualAmount = modWithNegative(amount, arr.length);

	return [...arr.slice(actualAmount), ...arr.slice(0, actualAmount)];
};
