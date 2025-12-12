<script lang="ts">
	import TwoSidedToggleLink from '$lib/TwoSidedToggleLink.svelte';

	const { showFretboard }: { showFretboard: boolean } = $props();
</script>

<div class="flex flex-wrap gap-4 pb-4">
	<div class="mr-auto flex">
		<h1 class="text-4xl">Identify Chords</h1>
		<p class="ml-2 text-lg">
			{#if !showFretboard}(Now supporting realtime MIDI!){/if}
		</p>
	</div>

	<div class="bg-surface-2 flex h-12 w-72 rounded-full">
		<TwoSidedToggleLink
			first="Keyboard"
			second="Fretboard"
			checked={showFretboard}
			firstHref="/chord-identifier/keyboard"
			secondHref="/chord-identifier/fretboard"
		/>
	</div>
</div>
