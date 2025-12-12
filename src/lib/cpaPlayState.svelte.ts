import { SvelteMap } from 'svelte/reactivity';
import type { CpaStateChange } from './cpaState.svelte';
import { Pitch } from './Pitch';
import type { Playback } from './Playback';

export const createCpaPlayState = (playback: Playback) => {
	const endSounds: Map<string, () => void> = new SvelteMap();

	const onCpaChangePlay = (change: CpaStateChange) => {
		if (change.tag === 'enable') {
			const disable = playback.playPitch(change.pitch, playback.now());

			const printed = Pitch.print(Pitch.fromCanonical(change.pitch));

			endSounds.set(printed, () => disable(playback.now()));
			return;
		}

		if (change.tag === 'disable') {
			const printed = Pitch.print(Pitch.fromCanonical(change.pitch));

			endSounds.get(printed)?.();
			endSounds.delete(printed);

			return;
		}
	};

	return { onCpaChangePlay };
};
