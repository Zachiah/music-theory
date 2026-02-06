<script lang="ts">
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import Button from '$lib/Button.svelte';
	import { getChordFromName } from '$lib/chord/getChordFromName';
	import SEO from '$lib/SEO.svelte';
	import { printChord } from '$lib/chord/printChord';
	import { ScaleDegree } from '$lib/chord/scaleDegree';
	import Container from '$lib/Container.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import { playback } from '$lib/Playback';
	import { Pitch } from '$lib/Pitch';
	import { PitchClass } from '$lib/PitchClass';
	import SubContainer from '$lib/SubContainer.svelte';

	let typedChordName = $state('');

	const chord = $derived(getChordFromName(typedChordName));
	const pitches = $derived(chord?.getPitchesFromOctave(3) ?? []);
	const canonicalPitches = $derived(pitches.map((pitch) => Pitch.toCanonical(pitch)));
</script>

<SEO title="Chord Lookup" />

<Container>
	<h1 class="text-2xl">Chord Lookup</h1>
	<p>
		(still very early, doesn't work with a lot of chords, please <a
			class="text-primary"
			href="https://github.com/Zachiah/music-theory/issues/new">make a GitHub issue</a
		> if you find something broken)
	</p>

	<div class="flex flex-wrap gap-4">
		<FancyInput placeholder="Type a Chord Name" bind:value={typedChordName} />

		{#if chord}
			<SubContainer>
				Resolved: {printChord(chord, musicDisplayOptions.data)}
			</SubContainer>

			<SubContainer class="text-nowrap">
				Notes: {pitches
					.map((p) => p.pitchClass)
					.map((p) => PitchClass.print(p, musicDisplayOptions.data))
					.join(', ')}
			</SubContainer>

			<Button
				style="primary"
				icon="icon-[heroicons--speaker-wave]"
				disabled={canonicalPitches.length === 0}
				onClick={() => {
					playback.demoChord(canonicalPitches, playback.now());
				}}
			/>
		{:else if typedChordName}
			<div class="bg-warning rounded-md p-4">
				Unable to resolve chord: <span class="font-bold">{typedChordName}</span>. If it is valid
				please
				<a
					class="text-primary bg-surface-1"
					href="https://github.com/Zachiah/music-theory/issues/new">make a GitHub issue</a
				> talking about it. Thanks!
			</div>
		{/if}
	</div>

	{#if chord}
		{@const keyboardStart = CanonicalPitch.whiteNoteBelow(
			CanonicalPitch.applyOffset(Pitch.toCanonical(pitches[0]), -6),
		)}
		{@const keyboardEnd = CanonicalPitch.whiteNoteAbove(
			CanonicalPitch.applyOffset(Pitch.toCanonical(pitches[pitches.length - 1]), +6),
		)}
		{@const keyboardLength =
			CanonicalPitch.height(keyboardEnd) - CanonicalPitch.height(keyboardStart) + 1}
		<div class="flex gap-4">
			<SubContainer>
				<Keyboard start={keyboardStart} noteNumber={keyboardLength} highlighted={canonicalPitches}>
					{#snippet renderKeyText(cp)}
						{@const pIdx = canonicalPitches.findIndex((p) => CanonicalPitch.equal(p, cp))}

						{#if pIdx !== -1}
							<div class="flex flex-col">
								<span>{PitchClass.print(pitches[pIdx].pitchClass, musicDisplayOptions.data)}</span>
								<span>{ScaleDegree.print(chord!.scaleDegrees[pIdx])}</span>
							</div>
						{/if}
					{/snippet}
				</Keyboard>
			</SubContainer>
		</div>
	{/if}
</Container>
