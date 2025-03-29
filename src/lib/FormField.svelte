<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		error,
		label,
		el = 'label'
	}: {
		children: Snippet<[]>;
		error: string;
		label: string;
		el?: string;
	} = $props();
</script>

<svelte:element this={el} class="flex max-w-lg flex-col gap-2">
	<div class="text-red-500">{error}</div>
	<div class="text-gray-800 dark:text-gray-300">{label}</div>
	{@render children()}
</svelte:element>
