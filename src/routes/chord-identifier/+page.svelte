<script lang="ts">
	import TwoSidedToggle from '$lib/TwoSidedToggle.svelte';
	import Container from '../Container.svelte';
	import FretboardChordIdentifier from './FretboardChordIdentifier.svelte';
	import PianoChordIdentifier from './PianoChordIdentifier.svelte';

	let showFretboard = $state(false);
</script>

<Container>
	<div class="flex pb-4">
		<h1 class="mr-auto text-4xl">Identify Chords</h1>

		<div class="flex h-12 w-72 rounded-full bg-gray-200">
			<TwoSidedToggle
				first="Keyboard"
				second="Fretboard"
				checked={showFretboard}
				onChange={(c) => {
					showFretboard = c;
				}}
			/>
		</div>
	</div>

	{#if showFretboard}
		<FretboardChordIdentifier />
	{:else}
		<PianoChordIdentifier />
	{/if}
</Container>
