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

<svelte:window
	onkeyup={(e) => {
		if (e.key === 'Escape') {
			onClose();
		}
	}}
/>

{#if open}
	<div
		role="presentation"
		class="fixed top-0 right-0 bottom-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-gray-800/80 dark:bg-slate-600/80"
		onmousedown={(e) => {
			console.log('running', e.currentTarget, e.target);
			if (
				e.currentTarget === e.target ||
				e.currentTarget === (e.target as HTMLElement).parentNode
			) {
				onClose();
			}
		}}
		transition:fade={{ duration: 100 }}
	>
		<div class="absolute flex h-full w-full items-center justify-center">
			{@render children()}
		</div>
	</div>
{/if}
