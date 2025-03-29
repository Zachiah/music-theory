<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	const {
		children,
		onClose,
		open
	}: {
		children: Snippet<[]>;
		onClose(): void;
		open: boolean;
	} = $props();
</script>

{#if open}
	<div
		role="presentation"
		class="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-800/80 dark:bg-slate-600/80"
		onclick={(e) => {
			if (e.currentTarget === e.target) {
				onClose();
			}
		}}
		transition:fade={{ duration: 100 }}
	>
		{@render children()}
	</div>
{/if}
