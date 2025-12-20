import { SvelteSet } from 'svelte/reactivity';

type Listener = (event: MIDIMessageEvent) => void;

export const midiAccess = (() => {
	let access: MIDIAccess | null = $state(null);
	const listeners = new SvelteSet<Listener>();

	const handler: Listener = (event) => {
		for (const listener of listeners) {
			listener(event);
		}
	};

	return {
		get access() {
			return access;
		},
		async requestAccess() {
			if (access) {
				return;
			}

			try {
				access = await navigator.requestMIDIAccess();
				access.inputs.forEach((entry) => {
					entry.addEventListener('midimessage', handler);
				});
			} catch {
				access = null;
			}
		},
		listen(cb: Listener) {
			listeners.add(cb);

			return () => {
				listeners.delete(cb);
			};
		},
	};
})();
