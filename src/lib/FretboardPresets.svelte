<script lang="ts">
	import type { Fretboard } from './Fretboard';

	const {
		activeFretboard,
		onSelect,
		presets
	}: {
		activeFretboard: Fretboard;
		onSelect(f: Fretboard): void;
		presets: Fretboard[];
	} = $props();
</script>

<div class="flex flex-col gap-4 py-4">
	<h2 class="text-2xl">Fretboard</h2>

	<div class="flex flex-wrap gap-4">
		{#each presets as preset}
			{@const current = activeFretboard.name === preset.name}
			<button
				class="rounded-md px-4 py-2 duration-100 hover:bg-blue-500"
				class:bg-blue-500={current}
				class:bg-gray-200={!current}
				onclick={() => {
					onSelect(preset);
				}}>{preset.name}</button
			>
		{/each}
	</div>
</div>
