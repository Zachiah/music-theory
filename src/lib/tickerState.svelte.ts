import { SvelteDate } from 'svelte/reactivity';

export const tickerState = (() => {
	let tick = $state(0);

	if (typeof window !== 'undefined') {
		setInterval(() => {
			tick = +new SvelteDate();
		}, 100);
	}

	return {
		get tick() {
			return tick;
		}
	};
})();
