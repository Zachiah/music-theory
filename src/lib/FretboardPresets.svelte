<script lang="ts">
	import Button from './Button.svelte';
	import type { Fretboard } from './Fretboard';
	import FretboardEditor from './FretboardEditor.svelte';
	import SubContainer from './SubContainer.svelte';

	const {
		activeFretboard,
		onSelect,
		presets,
		editing,
		onDelete,
		onUpdate
	}: {
		activeFretboard: Fretboard;
		onSelect(id: string): void;
		presets: Fretboard[];
		editing: boolean;
		onDelete(id: string): void;
		onUpdate(id: string, n: Fretboard): void;
	} = $props();

	let confirmingDelete = $state<string | undefined>(undefined);

	let editingOpen = $state<string | undefined>(undefined);
</script>

<div class="flex flex-wrap gap-4">
	{#each presets as preset (preset.id)}
		{@const current = activeFretboard.name === preset.name}
		{#if editing}
			<SubContainer padding="text" class="flex items-center gap-2">
				<span>{preset.name}</span>
				<button
					aria-label="Edit"
					title="Edit"
					class="cursor-pointer rounded-md border p-1 px-2"
					onclick={() => (editingOpen = preset.id)}
				>
					<span class="icon-[heroicons--pencil]"></span>
				</button>
				<button
					aria-label={presets.length === 1 ? "You can't delete the last preset" : 'Delete'}
					title={presets.length === 1 ? "You can't delete the last preset" : 'Delete'}
					disabled={presets.length === 1}
					class="disabled:text-text-disabled cursor-pointer rounded-md border p-1 px-2 disabled:cursor-not-allowed"
					onclick={() => {
						if (confirmingDelete === preset.id) {
							onDelete(preset.id);
						} else {
							confirmingDelete = preset.id;
						}
					}}
				>
					{#if confirmingDelete === preset.id}
						<span class="icon-[heroicons--check]"></span>
					{:else}
						<span class="icon-[heroicons--trash]"></span>
					{/if}
				</button>
			</SubContainer>
		{:else}
			<Button
				style={current ? 'primary' : 'neutral'}
				onClick={() => {
					onSelect(preset.id);
				}}>{preset.name}</Button
			>
		{/if}
	{/each}

	<FretboardEditor
		open={!!editingOpen}
		baseFretboard={presets.find((f) => f.id === editingOpen) || presets[0]}
		onClose={() => (editingOpen = undefined)}
		onSave={(f) => onUpdate(editingOpen!, f)}
	/>
</div>
