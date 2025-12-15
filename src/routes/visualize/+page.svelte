<script lang="ts">
	import Container from '$lib/Container.svelte';
	import FullScreenable from '$lib/FullScreenable.svelte';
	import { createCpaHistoryState } from '$lib/cpaHistoryState.svelte';
	import { createCpaPlayState } from '$lib/cpaPlayState.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { findPitchForEventByKeybind, getFormattedKeybindForPitch } from '$lib/keyboardKeybinds';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import MovingNotesVisualization, {
		vizColorSchemes,
		type VizColorScheme
	} from '$lib/MovingNotesVisualization.svelte';
	import { PitchConstituents } from '$lib/PitchConstituents';
	import { playback } from '$lib/Playback';
	import { onMount } from 'svelte';
	import Button from '$lib/Button.svelte';
	import FancySelect from '$lib/FancySelect.svelte';

	let audible = $state(true);
	let showKeybinds = $state(true);
	let colorScheme: VizColorScheme = $state('bw');

	const cpaPlayState = createCpaPlayState(playback);
	const cpaHistoryState = createCpaHistoryState(20000);
	const cpaState = createCpaState({
		onChange(change) {
			if (audible) {
				cpaPlayState.onCpaChangePlay(change);
			}
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

	const numWhiteNotes =
		PitchConstituents.letterBasedHeight('C', 8) - PitchConstituents.letterBasedHeight('A', 0) + 1;

	let wrapperWidth: number = $state(1000);

	const whiteKeyWidth = $derived(Math.max(wrapperWidth / numWhiteNotes, 25));
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

	<FullScreenable>
		{#snippet actions()}
			<div class="w-32">
				<FancySelect
					bind:value={colorScheme}
					placeholder="Color Scheme"
					options={vizColorSchemes.map((s) => ({ label: s, value: s }))}
				/>
			</div>
			<Button
				onClick={() => {
					audible = !audible;
				}}
				style={audible ? 'primary' : 'neutral'}
				icon="icon-[heroicons--speaker-wave]"
			/>
			<Button
				onClick={() => {
					showKeybinds = !showKeybinds;
				}}
				style={showKeybinds ? 'primary' : 'neutral'}
				icon="icon-[heroicons--eye]"
			/>
		{/snippet}

		{#snippet children({ fullscreen })}
			<div class="bg-always-black rounded-md p-4">
				<div
					class="flex flex-col overflow-auto"
					class:h-[calc(100vh-250px)]={!fullscreen}
					class:h-[calc(100vh-20px)]={fullscreen}
					bind:clientWidth={wrapperWidth}
				>
					<MovingNotesVisualization
						{colorScheme}
						history={cpaHistoryState.cpaHistory}
						{whiteKeyWidth}
						start={{ pitchClass: 'A', octave: 0 }}
					/>

					<Keyboard
						{whiteKeyWidth}
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
								{#if showKeybinds}
									<span>{keybind}</span>
								{/if}
							</div>
						{/snippet}
					</Keyboard>
				</div>
			</div>
		{/snippet}
	</FullScreenable>
</Container>
