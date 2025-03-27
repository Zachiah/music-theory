<script lang="ts">
	import { GuessedChord } from '$lib/guessChord';
	import TwoSidedToggle from '$lib/TwoSidedToggle.svelte';
	import Container from '../Container.svelte';
	import FretboardChordIdentifier from './FretboardChordIdentifier.svelte';
	import PianoChordIdentifier from './PianoChordIdentifier.svelte';

	let showFretboard = $state(false);

	let options = $state<GuessedChord.PrintingOptions>({
		six: true,
		sixNine: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	});

	const onOptionsChange = (o: GuessedChord.PrintingOptions) => {
		options = o;
	};
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
		<FretboardChordIdentifier {options} {onOptionsChange} />
	{:else}
		<PianoChordIdentifier {options} {onOptionsChange} />
	{/if}
</Container>
