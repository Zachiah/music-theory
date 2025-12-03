<script lang="ts">
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import Container from '$lib/Container.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import { Pitch } from '$lib/Pitch';
	import { playback } from '$lib/Playback';
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	const KEYBOARD_START: CanonicalPitch = { pitchClass: 'C', octave: 2 };
	const KEYBOARD_LENGTH = 49;
	const KEYBOARD_END = CanonicalPitch.applyOffset(KEYBOARD_START, KEYBOARD_LENGTH - 1);

	const KEYBINDS_RAW = [
		['Tab', 'Tab'],
		['1', '!'],
		['q', 'Q'],
		['2', '@'],
		['w', 'W'],
		['e', 'E'],
		['4', '$'],
		['r', 'R'],
		['5', '%'],
		['t', 'T'],
		['6', '^'],
		['y', 'Y'],
		['u', 'U'],
		['8', '*'],
		['i', 'I'],
		['9', '('],
		['o', 'O'],
		['p', 'P'],
		['-', '_'],
		['[', '{'],
		['=', '+'],
		[']', '}'],
		['Backspace', 'Backspace'],
		['\\', '|'],
		['ShiftLeft', 'ShiftLeft'],
		['a', 'A'],
		['z', 'Z'],
		['s', 'S'],
		['x', 'X'],
		['c', 'C'],
		['f', 'F'],
		['v', 'V'],
		['g', 'G'],
		['b', 'B'],
		['h', 'H'],
		['n', 'N'],
		['m', 'M'],
		['k', 'K'],
		[',', '<'],
		['l', 'L'],
		['.', '>'],
		['/', '?'],
		["'", '"'],
		['ShiftRight', 'ShiftRight']
	];

	const KEYBINDS = KEYBINDS_RAW.map(([key, shifted], keyIdx) => {
		const canonicalPitch = CanonicalPitch.applyOffset(KEYBOARD_START, keyIdx);

		return { key, shifted, canonicalPitch };
	});

	const findKeybind = (e: KeyboardEvent) => {
		return KEYBINDS.find((k) => {
			if (k.key.includes('Shift')) {
				console.log('here');
				console.log(e.code, k.key);
				return k.key === e.code || (k.shifted === e.code && e.shiftKey);
			}
			return k.key === e.key || (k.shifted === e.key && e.shiftKey);
		});
	};

	const endSounds: Map<string, () => void> = new SvelteMap();

	const cpaState = createCpaState({
		onChange: (change) => {
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
		}
	});

	onMount(() => {
		midiAccess.requestAccess();
		return midiAccess.listen((e) => {
			const m = decodeMIDIMessage(e);

			if (m.tag === 'note-down') {
				cpaState.enable(m.pitch);
			}

			if (m.tag === 'note-up') {
				cpaState.disable(m.pitch);
			}
		});
	});
</script>

<svelte:window
	onkeydown={(e) => {
		e.preventDefault();
		if (e.repeat || e.metaKey) {
			return;
		}

		const keybind = findKeybind(e);

		if (!keybind) {
			return;
		}

		cpaState.enable(keybind.canonicalPitch);
	}}
	onkeyup={(e) => {
		const keybind = findKeybind(e);

		if (e.metaKey) {
			return;
		}

		if (!keybind) {
			return;
		}

		cpaState.disable(keybind.canonicalPitch);
	}}
/>

<Container>
	<div class="flex">
		<h1 class="text-4xl">Piano</h1>
		<p>(Supports MIDI)</p>
	</div>

	<Keyboard
		noteNumber={49}
		start={{ pitchClass: 'C', octave: 2 }}
		pitchData={CanonicalPitch.getRangeInclusive(KEYBOARD_START, KEYBOARD_END).map((cp) => {
			const included = !!cpaState.selected.find((cpaStateCp) =>
				CanonicalPitch.equal(cpaStateCp, cp)
			);

			const k =
				KEYBINDS.find((k) => CanonicalPitch.equal(k.canonicalPitch, cp))?.key.toUpperCase() || '';

			const betterKeybindName = k
				.replace('SHIFT', '⇧')
				.replace('BACKSPACE', '←')
				.replace('LEFT', '←')
				.replace('RIGHT', '→');

			return {
				canonicalPitch: cp,
				labeled: false,
				extraText: betterKeybindName,
				highlighted: included
			};
		})}
		onMouseDown={cpaState.enable}
		onMouseEnter={(p, pressed) => {
			if (pressed) {
				cpaState.enable(p);
			}
		}}
		onMouseUp={cpaState.disable}
		onMouseOut={cpaState.disable}
	/>
</Container>
