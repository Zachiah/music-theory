<script lang="ts">
	import { getChordFromName } from '$lib/chord/getChordFromName';
	import { printChord } from '$lib/chord/printChord';
	import Container from '$lib/Container.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import SubContainer from '$lib/SubContainer.svelte';

	let typedChordName = $state('');

	const chord = $derived(getChordFromName(typedChordName));
</script>

<Container>
	<h1 class="text-2xl">
		Chord Lookup (very early, doesn't work with most chords, please check back later)
	</h1>

	<FancyInput placeholder="Type a Chord Name" bind:value={typedChordName} />

	<div class="flex gap-4">
		<SubContainer>
			Standardized: &nbsp;{chord ? printChord(chord, musicDisplayOptions.data) : chord}
		</SubContainer>
	</div>
</Container>
