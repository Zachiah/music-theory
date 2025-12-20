import { SvelteDate } from 'svelte/reactivity';

export const createTickerState = (interval: number) => {
	let tick = $state(0);

	$effect(() => {
		const intervalHandle = setInterval(() => {
			tick = +new SvelteDate();
		}, interval);

		return () => clearInterval(intervalHandle);
	});

	return {
		get tick() {
			return tick;
		},
	};
};
