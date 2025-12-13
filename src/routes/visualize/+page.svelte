<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { createCpaHistoryState } from '$lib/cpaHistoryState.svelte';
	import { createCpaPlayState } from '$lib/cpaPlayState.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { findPitchForEventByKeybind, getFormattedKeybindForPitch } from '$lib/keyboardKeybinds';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import MovingNotesVisualization from '$lib/MovingNotesVisualization.svelte';
	import { playback } from '$lib/Playback';
	import { onMount } from 'svelte';

	const cpaPlayState = createCpaPlayState(playback);
	const cpaHistoryState = createCpaHistoryState(10000);
	const cpaState = createCpaState({
		onChange(change) {
			cpaPlayState.onCpaChangePlay(change);
			cpaHistoryState.onCpaChangeHistory(change);
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
		if (e.metaKey) {
			return;
		}

		const keybind = findPitchForEventByKeybind(e);

		if (!keybind) {
			return;
		}

		e.preventDefault();

		if (e.repeat) {
			return;
		}

		cpaState.enable(keybind.canonicalPitch);
	}}
	onkeyup={(e) => {
		const keybind = findPitchForEventByKeybind(e);

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
		<h1 class="text-4xl">Visualize</h1>
		<p>(Supports MIDI)</p>
	</div>

	<div class="bg-always-black flex flex-col overflow-auto rounded-md p-4">
		<MovingNotesVisualization
			history={cpaHistoryState.cpaHistory}
			whiteKeyWidth={27}
			start={{ pitchClass: 'A', octave: 0 }}
		/>

		<Keyboard
			whiteKeyWidth={27}
			noteNumber={88}
			start={{ pitchClass: 'A', octave: 0 }}
			highlighted={cpaState.selected}
			onMouseDown={cpaState.enable}
			onMouseEnter={(p, pressed) => {
				if (pressed) {
					cpaState.enable(p);
				}
			}}
			onMouseUp={cpaState.disable}
			onMouseOut={cpaState.disable}
		>
			{#snippet renderKeyText(cp)}
				{@const keybind = getFormattedKeybindForPitch(cp)}

				<div class="flex flex-col">
					<span>{keybind}</span>
				</div>
			{/snippet}
		</Keyboard>
	</div>
</Container>
