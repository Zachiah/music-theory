export const createLocalStorageState = <T>(
	key: string,
	version: number,
	defaultValue: T,
	convertOldValues: null | ((oldValue: { version: number; value: unknown }) => T) = null,
) => {
	const initialValue = (() => {
		if (typeof localStorage === 'undefined') {
			return defaultValue;
		}

		const str = localStorage.getItem(key);

		if (!str) {
			return defaultValue;
		}

		const value: { version: number; value: T } = JSON.parse(str);
		if (value.version !== version) {
			if (convertOldValues) {
				return convertOldValues(value);
			}

			return defaultValue;
		}

		return value.value;
	})();

	let state = $state(initialValue);

	return {
		get data() {
			return state;
		},
		set data(newV: T) {
			state = newV;
			localStorage.setItem(key, JSON.stringify({ version, value: state }));
		},
	};
};
