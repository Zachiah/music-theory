<script lang="ts">
	import { GuessedChord } from '$lib/guessChord';
	import Container from '$lib/Container.svelte';
	import FretboardChordIdentifier from './FretboardChordIdentifier.svelte';
	import KeyboardChordIdentifier from './KeyboardChordIdentifier.svelte';

	import { page } from '$app/state';
	import TwoSidedToggleLink from '$lib/TwoSidedToggleLink.svelte';

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

	const showFretboard = $derived(page.params.instrument === 'fretboard');
</script>

<Container>
	<div class="flex pb-4">
		<h1 class="mr-auto text-4xl">Identify Chords</h1>

		<div class="flex h-12 w-72 rounded-full bg-gray-200">
			<TwoSidedToggleLink
				first="Keyboard"
				second="Fretboard"
				checked={showFretboard}
				firstHref="/chord-identifier/keyboard"
				secondHref="/chord-identifier/fretboard"
			/>
		</div>
	</div>

	{#if showFretboard}
		<FretboardChordIdentifier {options} {onOptionsChange} />
	{:else}
		<KeyboardChordIdentifier {options} {onOptionsChange} />
	{/if}
</Container>
