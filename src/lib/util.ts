export const formatTimeString = (s: number) => {
	const SECONDS_IN_MINUTE = 60;
	const MINUTES_IN_HOUR = 60;
	const HOURS_IN_DAY = 24;

	const SECONDS_IN_DAY = SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;
	const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;

	const days = Math.floor(s / SECONDS_IN_DAY);
	const hours = Math.floor((s % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
	const minutes = Math.floor((s % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
	const seconds = s % SECONDS_IN_MINUTE;

	return [days && `${days}d`, hours && `${hours}h`, minutes && `${minutes}m`, `${seconds}s`]
		.filter((s) => s)
		.join(' ');
};

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

export const chooseRandom = <T>(arr: T[]): T => {
	if (arr.length === 0) {
		throw new Error("Can't get random element of empty array");
	}

	const idx = Math.floor(Math.random() * arr.length);

	return arr[idx];
};

export const minByIndex = <T>(arr: T[], by: (a: T) => number) => {
	if (arr.length === 0) {
		throw new Error('minBy does not work on empty arrays');
	}
	let bestIndex = 0;
	let bestBy = by(arr[0]);
	for (let i = 1; i < arr.length; i++) {
		const itemBy = by(arr[i]);

		if (itemBy < bestBy) {
			bestIndex = i;
			bestBy = itemBy;
		}
	}

	return bestIndex;
};

export const minBy = <T>(arr: T[], by: (a: T) => number) => {
	return arr[minByIndex(arr, by)];
};

export const maxByIndex = <T>(arr: T[], by: (a: T) => number) => {
	if (arr.length === 0) {
		throw new Error('maxBy does not work on empty arrays');
	}
	let bestIndex = 0;
	let bestBy = by(arr[0]);
	for (let i = 1; i < arr.length; i++) {
		const itemBy = by(arr[i]);

		if (itemBy > bestBy) {
			bestIndex = i;
			bestBy = itemBy;
		}
	}

	return bestIndex;
};

export const maxBy = <T>(arr: T[], by: (a: T) => number) => {
	return arr[maxByIndex(arr, by)];
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
