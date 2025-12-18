<script lang="ts">
	import { getChordFromName } from '$lib/chord/getChordFromName';
	import { printChord } from '$lib/chord/printChord';
	import Container from '$lib/Container.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import { Pitch } from '$lib/Pitch';
	import SubContainer from '$lib/SubContainer.svelte';

	let typedChordName = $state('');

	const chord = $derived(getChordFromName(typedChordName));
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

	<div class="flex gap-4">
		<SubContainer>
			<Keyboard
				start={{ pitchClass: 'C', octave: 3 }}
				noteNumber={37}
				highlighted={chord?.getPitchesFromOctave(3).map((p) => Pitch.toCanonical(p)) ?? []}
			>
				{#snippet renderKeyText()}{/snippet}
			</Keyboard>
		</SubContainer>
	</div>
</Container>
