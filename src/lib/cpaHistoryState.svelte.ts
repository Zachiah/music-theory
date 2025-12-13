import type { CpaStateChange } from './cpaState.svelte';
import { CanonicalPitch } from './CanonicalPitch';

export type CpaHistoryItem = {
	start: number;
	end?: number;
	pitch: CanonicalPitch;
};

export const createCpaHistoryState = (maxLifeMs: number) => {
	const cpaHistory: { value: CpaHistoryItem[] } = $state({ value: [] });

	$effect(() => {
		const interval = setInterval(() => {
			const now = Date.now();
			cpaHistory.value = cpaHistory.value.filter((item) => {
				return item.end ? now - item.end <= maxLifeMs : true;
			});
		}, maxLifeMs);

		return () => clearInterval(interval);
	});

	const onCpaChangeHistory = (change: CpaStateChange) => {
		if (change.tag === 'enable') {
			cpaHistory.value.push({ start: Date.now(), pitch: change.pitch });
		}

		if (change.tag === 'disable') {
			const historyItem = cpaHistory.value.find(
				(item) => CanonicalPitch.equal(item.pitch, change.pitch) && !item.end
			);

			if (historyItem) {
				historyItem.end = Date.now();
			}
		}
	};

	return {
		onCpaChangeHistory,
		get cpaHistory() {
			return cpaHistory.value;
		}
	};
};
