export const modWithNegative = (a: number, b: number, supportNaN = false): number => {
	if (isNaN(a) || isNaN(b)) {
		if (supportNaN) return NaN;
		throw new Error(`One was NaN: ${a}, ${b}`);
	}

	return ((a % b) + b) % b;
};

export const rotateArray = <T>(arr: T[], amount: number): T[] => {
	const actualAmount = modWithNegative(amount, arr.length);

	return [...arr.slice(actualAmount), ...arr.slice(0, actualAmount)];
};

export const minBy = <T>(arr: T[], by: (a: T) => number) => {
	if (arr.length === 0) {
		throw new Error('minBy does not work on empty arrays');
	}
	let best = arr[0];
	let bestBy = by(arr[0]);
	for (const item of arr) {
		const itemBy = by(item);

		if (itemBy < bestBy) {
			best = item;
			bestBy = itemBy;
		}
	}

	return best;
};

export const maxBy = <T>(arr: T[], by: (a: T) => number) => {
	if (arr.length === 0) {
		throw new Error('maxBy does not work on empty arrays');
	}
	let best = arr[0];
	let bestBy = by(arr[0]);
	for (const item of arr) {
		const itemBy = by(item);

		if (itemBy > bestBy) {
			best = item;
			bestBy = itemBy;
		}
	}

	return best;
};

export const inclusiveRange = (low: number, high: number) => {
	return Array.from({ length: high - low + 1 }, (_, i) => low + i);
};

export const breakApartArray = <T>(arr: T[], goTogether: (a: T, b: T) => boolean): T[][] => {
	return arr.reduce<T[][]>((res, item) => {
		if (res.length === 0) {
			res.push([item]);
			return res;
		}

		const lastGroup = res[res.length - 1];
		const last = lastGroup[lastGroup.length - 1];

		if (goTogether(last, item)) {
			lastGroup.push(item);
			return res;
		}

		res.push([item]);
		return res;
	}, []);
};
