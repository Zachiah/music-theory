<script lang="ts">
	let {
		value = $bindable(),
		options,
		placeholder,
	}: { value: string; options: { value: string; label: string }[]; placeholder: string } = $props();

	let search: string = $state('');

	const filteredOptions = $derived(
		options.filter((option) => {
			const searchWords = search.toLowerCase().split(' ');
			return searchWords.every((word) => option.label.toLowerCase().includes(word));
		}),
	);

	const selectedIdx = $derived(filteredOptions.findIndex((o) => o.value === value));

	let activeIdx: number | null = $state(null);
</script>

<div
	class="bg-surface-2 text-text relative h-13 w-full rounded-md"
	onfocusout={async (e) => {
		if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget as Node)) {
			return;
		}

		activeIdx = null;
		search = '';
	}}
>
	<div class="text-text-placeholder absolute top-0.5 left-3 text-xs">{placeholder}</div>
	<input
		placeholder={options.find((o) => o.value === value)?.label || ''}
		onclick={() => (activeIdx = 0)}
		onfocus={() => (activeIdx = 0)}
		class="placeholder:text-text absolute top-0 left-0 h-full w-full cursor-pointer rounded-md bg-transparent focus:cursor-text focus:placeholder:text-transparent"
		onkeyup={(e) => {
			if (e.key === 'ArrowDown') {
				activeIdx = Math.min(activeIdx! + 1, options.length - 1);
			} else if (e.key === 'ArrowUp') {
				activeIdx = Math.max(0, activeIdx! - 1);
			} else if (e.key === 'Enter') {
				value = filteredOptions[activeIdx!].value;
			} else if (e.key === 'Escape' && activeIdx !== null) {
				activeIdx = null;
			} else {
				return;
			}

			e.stopPropagation();
		}}
		bind:value={
			() => search,
			(v) => {
				search = v;
				activeIdx = 0;
			}
		}
	/>

	<span
		class="icon-[heroicons--chevron-down] pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
	></span>

	{#if activeIdx !== null}
		<div
			class="bg-surface-2 absolute bottom-0 z-20 flex max-h-72 w-full translate-y-full transform flex-col overflow-auto rounded-md shadow-2xl"
		>
			{#each filteredOptions as option, idx (option.label)}
				<button
					tabindex="-1"
					class="border-bottom border-white px-4 py-2 text-left"
					class:bg-surface-1-alt={idx === selectedIdx && !(idx === activeIdx)}
					class:bg-surface-1={idx === activeIdx}
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
