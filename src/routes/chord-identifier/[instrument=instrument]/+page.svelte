<script lang="ts">
	import { GuessedChord } from '$lib/guessChord';
	import Container from '$lib/Container.svelte';
	import FretboardChordIdentifier from './FretboardChordIdentifier.svelte';
	import KeyboardChordIdentifier from './KeyboardChordIdentifier.svelte';

	import { page } from '$app/state';
	import TwoSidedToggleLink from '$lib/TwoSidedToggleLink.svelte';
	import { createLocalStorageState } from '$lib/localStorageState.svelte';

	let options = createLocalStorageState<GuessedChord.PrintingOptions>('printingOptions', 1, {
		six: true,
		sixNine: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	});

	const onOptionsChange = (o: GuessedChord.PrintingOptions) => {
		options.data = o;
	};

	const showFretboard = $derived(page.params.instrument === 'fretboard');
</script>

<Container>
	<div class="flex pb-4">
		<h1 class="mr-auto text-4xl">Identify Chords</h1>

		<div class="flex h-12 w-72 rounded-full bg-gray-200 dark:bg-slate-600">
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
		<FretboardChordIdentifier options={options.data} {onOptionsChange} />
	{:else}
		<KeyboardChordIdentifier options={options.data} {onOptionsChange} />
	{/if}
</Container>
