<script lang="ts">
	import TwoSidedToggleLink from '$lib/TwoSidedToggleLink.svelte';

	const { showFretboard }: { showFretboard: boolean } = $props();
</script>

<div class="flex flex-wrap gap-4 pb-4">
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
