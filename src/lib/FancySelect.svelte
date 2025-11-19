<script lang="ts">
	let {
		value = $bindable(),
		options
	}: { value: string; options: { value: string; label: string }[] } = $props();

	let search: string = $state('');

	const filteredOptions = $derived(
		options.filter((option) => {
			const searchWords = search.toLowerCase().split(' ');
			return searchWords.every((word) => option.label.toLowerCase().includes(word));
		})
	);

	const selectedIdx = $derived(filteredOptions.findIndex((o) => o.value === value));

	let activeIdx: number | null = $state(null);
</script>

<div
	class="relative w-full flex-1 rounded-r-md dark:bg-slate-600 dark:text-white"
	onfocusout={async (e) => {
		if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
			return;
		}

		activeIdx = null;
		search = '';
	}}
>
	<input
		placeholder={options.find((o) => o.value === value)?.label || ''}
		onclick={() => (activeIdx = 0)}
		onfocus={() => (activeIdx = 0)}
		class="absolute top-0 left-0 w-full bg-transparent dark:placeholder:text-slate-300"
		onkeydown={(e) => {
			if (e.key === 'ArrowDown') {
				activeIdx = Math.min(activeIdx! + 1, options.length - 1);
			} else if (e.key === 'ArrowUp') {
				activeIdx = Math.max(0, activeIdx! - 1);
			} else if (e.key === 'Enter') {
				value = filteredOptions[activeIdx!].value;
			} else if (e.key === 'Escape') {
				activeIdx = null;
			}
		}}
		bind:value={
			() => search,
			(v) => {
				search = v;
				activeIdx = 0;
			}
		}
	/>

	{#if activeIdx !== null}
		<div
			class="absolute bottom-0 z-20 flex max-h-72 w-full translate-y-full transform flex-col overflow-auto shadow-md dark:bg-slate-600"
		>
			{#each filteredOptions as option, idx (option.label)}
				<button
					tabindex="-1"
					class="border-bottom border-white px-4 py-2 text-left"
					class:dark:bg-slate-800={idx === selectedIdx}
					class:dark:bg-slate-700={idx === activeIdx}
					type="button"
					onclick={() => {
						value = option.value;
						activeIdx = null;
						search = '';
					}}
					onmousemove={() => {
						activeIdx = idx;
					}}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
