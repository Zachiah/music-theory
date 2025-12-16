<script lang="ts">
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import { normalizeChordPitchesWithOctaves, ScaleDegree } from '$lib/chord/categorizeChordNotes';
	import CircleOfFifths from '$lib/CircleOfFifths.svelte';
	import Container from '$lib/Container.svelte';
	import { createCpaPlayState } from '$lib/cpaPlayState.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import { guessChord } from '$lib/chord/guessChord';
	import Keyboard from '$lib/Keyboard.svelte';
	import {
		KEYBOARD_LENGTH,
		KEYBOARD_START,
		findPitchForEventByKeybind,
		getFormattedKeybindForPitch
	} from '$lib/keyboardKeybinds';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import { Pitch } from '$lib/Pitch';
	import { playback } from '$lib/Playback';
	import GrandStaff from '$lib/staff/GrandStaff.svelte';
	import SubContainer from '$lib/SubContainer.svelte';
	import { onMount } from 'svelte';
	import { Chord } from '$lib/chord/chord';
	import { PitchClass } from '$lib/PitchClass';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';

	const cpaPlayState = createCpaPlayState(playback);
	const cpaState = createCpaState({ onChange: cpaPlayState.onCpaChangePlay });

	const guessedChord = $derived.by(() => {
		if (cpaState.selected.length === 0) {
			return null;
		}

		const pitchClasses = cpaState.selected.map((p) => p.pitchClass);
		const guessedChord = guessChord(pitchClasses);

		return guessedChord;
	});

	const normalized = $derived(
		!guessedChord ? [] : normalizeChordPitchesWithOctaves(cpaState.selected, guessedChord)
	);

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
	<h2 class="mr-auto text-2xl">Keyboard + Chord Identifier (midi enabled)</h2>
	<SubContainer>
		<Keyboard
			onMouseDown={(p) => cpaState.enable(p)}
			onMouseUp={(p) => cpaState.disable(p)}
			onMouseOut={(p) => cpaState.disable(p)}
			onMouseEnter={(p, pressed) => {
				if (pressed) {
					cpaState.enable(p);
				}
			}}
			start={KEYBOARD_START}
			noteNumber={KEYBOARD_LENGTH}
			highlighted={cpaState.selected}
		>
			{#snippet renderKeyText(cp)}
				{@const keybind = getFormattedKeybindForPitch(cp)}
				{@const foundNormalized = normalized.find((n) =>
					CanonicalPitch.equal(Pitch.toCanonical(n.pitch), cp)
				)}

				<div class="flex flex-col">
					{#if foundNormalized}
						<span class="font-serif">{ScaleDegree.print(foundNormalized.scaleDegree)}</span>
						<span>{Pitch.print(foundNormalized.pitch, musicDisplayOptions.data)}</span>
					{/if}
					<span class="font-mono">{keybind}</span>
				</div>
			{/snippet}
		</Keyboard>
	</SubContainer>

	<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
		<SubContainer class="flex items-center justify-center">
			<GrandStaff notes={normalized.map((p) => p.pitch)} />
		</SubContainer>

		<SubContainer class="flex items-center justify-center">
			<CircleOfFifths
				highlighted={guessedChord ? PitchClass.toCanonicalPitchClass(guessedChord.root) : undefined}
				selected={normalized.map((n) => n.pitch.pitchClass)}
			/>
		</SubContainer>

		<SubContainer el="p" class="flex items-center justify-center text-3xl">
			&nbsp;{guessedChord ? Chord.print(guessedChord, musicDisplayOptions.data) : ''}
		</SubContainer>
	</div>
</Container>
