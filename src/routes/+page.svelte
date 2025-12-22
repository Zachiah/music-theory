<script lang="ts">
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import CircleOfFifths from '$lib/CircleOfFifths.svelte';
	import Container from '$lib/Container.svelte';
	import { createCpaPlayState } from '$lib/cpaPlayState.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import {
		KEYBOARD_LENGTH,
		KEYBOARD_START,
		findPitchForEventByKeybind,
		getFormattedKeybindForPitch,
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
	import { ScaleDegree } from '$lib/chord/scaleDegree';
	import { printChord } from '$lib/chord/printChord';
	import Button from '$lib/Button.svelte';
	import { getChordFromName } from '$lib/chord/getChordFromName';

	let audible = $state(true);
	const cpaPlayState = createCpaPlayState(playback);
	const cpaState = createCpaState({
		onChange: (c) => {
			if (audible) {
				cpaPlayState.onCpaChangePlay(c);
			}
		},
	});

	const guessedChord = $derived.by(() => {
		if (cpaState.selected.length === 0) {
			return null;
		}

		const pitchClasses = cpaState.selected.map((p) => p.pitchClass);
		const guessedChord = Chord.guessFromPitches(pitchClasses);

		return guessedChord;
	});

	const chordName = $derived(
		guessedChord ? printChord(guessedChord, musicDisplayOptions.data) : '',
	);

	const normalized = $derived(
		!guessedChord ? [] : guessedChord.getNormalizedPitchesWithOctaves(cpaState.selected),
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
	<h2 class="flex text-2xl">
		<span>Keyboard + Chord Identifier (midi enabled)</span>
		<span class="grow"></span>
		<Button
			style={audible ? 'primary' : 'neutral'}
			onClick={() => {
				audible = !audible;
			}}
			icon="icon-[heroicons--speaker-wave]"
		/>
	</h2>
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
					CanonicalPitch.equal(Pitch.toCanonical(n.pitch), cp),
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
			&nbsp;{chordName}
		</SubContainer>
	</div>

	{#if guessedChord}
		{@const rootedChord = new Chord(guessedChord.root, ['1', ...guessedChord.scaleDegrees])}
		{@const rootedChordName = printChord(rootedChord, musicDisplayOptions.data)}

		{@const standardizedChord = getChordFromName(rootedChordName)}
		{#if standardizedChord}
			{@const gcp = standardizedChord.getPitchesFromOctave(3) ?? []}
			{@const keyboardStart = CanonicalPitch.whiteNoteBelow(
				CanonicalPitch.applyOffset(Pitch.toCanonical(gcp[0]), -6),
			)}
			{@const keyboardEnd = CanonicalPitch.whiteNoteAbove(
				CanonicalPitch.applyOffset(Pitch.toCanonical(gcp[gcp.length - 1]), +6),
			)}
			{@const keyboardLength =
				CanonicalPitch.height(keyboardEnd) - CanonicalPitch.height(keyboardStart) + 1}
			<SubContainer class="flex flex-col gap-2">
				<p class="text-2xl">Standard Root Voicing</p>
				<Keyboard
					start={keyboardStart}
					noteNumber={keyboardLength}
					highlighted={gcp.map((g) => Pitch.toCanonical(g))}
				>
					{#snippet renderKeyText(cp)}
						{@const pIdx = gcp.findIndex((p) => CanonicalPitch.equal(Pitch.toCanonical(p), cp))}

						{#if pIdx !== -1}
							<div class="flex flex-col">
								<span>{PitchClass.print(gcp[pIdx].pitchClass, musicDisplayOptions.data)}</span>
								<span>{ScaleDegree.print(standardizedChord.scaleDegrees[pIdx])}</span>
							</div>
						{/if}
					{/snippet}
				</Keyboard>
			</SubContainer>
		{/if}
	{/if}
</Container>
