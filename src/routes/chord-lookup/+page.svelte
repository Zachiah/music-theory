<script lang="ts">
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import { getChordFromName } from '$lib/chord/getChordFromName';
	import { printChord } from '$lib/chord/printChord';
	import { ScaleDegree } from '$lib/chord/scaleDegree';
	import Container from '$lib/Container.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import { Pitch } from '$lib/Pitch';
	import { PitchClass } from '$lib/PitchClass';
	import SubContainer from '$lib/SubContainer.svelte';

	let typedChordName = $state('');

	const chord = $derived(getChordFromName(typedChordName));
	const pitches = $derived(chord?.getPitchesFromOctave(3) ?? []);

	const whiteNoteBelow = (pitch: CanonicalPitch) => {
		if (pitch.pitchClass.endsWith('b')) {
			return CanonicalPitch.applyOffset(pitch, -1);
		}
		return pitch;
	};

	const whiteNoteAbove = (pitch: CanonicalPitch) => {
		if (pitch.pitchClass.endsWith('b')) {
			return CanonicalPitch.applyOffset(pitch, 1);
		}
		return pitch;
	};
</script>

<Container>
	<h1 class="text-2xl">Chord Lookup</h1>
	<p>
		(still very early, doesn't work with a lot of chords, please <a
			class="text-primary"
			href="https://github.com/Zachiah/music-theory/issues/new">make a GitHub issue</a
		> if you find something broken)
	</p>

	<div class="flex gap-4">
		<FancyInput placeholder="Type a Chord Name" bind:value={typedChordName} />

		{#if chord}
			<SubContainer>
				Resolved: &nbsp;{chord ? printChord(chord, musicDisplayOptions.data) : chord}
			</SubContainer>
		{/if}
	</div>

	{#if chord}
		{@const keyboardStart = whiteNoteBelow(
			CanonicalPitch.applyOffset(Pitch.toCanonical(pitches[0]), -6)
		)}
		{@const keyboardEnd = whiteNoteAbove(
			CanonicalPitch.applyOffset(Pitch.toCanonical(pitches[pitches.length - 1]), +6)
		)}
		{@const keyboardLength =
			CanonicalPitch.height(keyboardEnd) - CanonicalPitch.height(keyboardStart) + 1}
		<div class="flex gap-4">
			<SubContainer>
				<Keyboard
					start={keyboardStart}
					noteNumber={keyboardLength}
					highlighted={pitches.map((p) => Pitch.toCanonical(p))}
				>
					{#snippet renderKeyText(cp)}
						{@const pIdx = pitches.findIndex((p) => CanonicalPitch.equal(Pitch.toCanonical(p), cp))}

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
