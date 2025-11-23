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

	let pressedInside = $state(false);
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
		onmouseup={() => {
			setTimeout(() => {
				pressedInside = false;
			});
		}}
		onclick={(e) => {
			if (pressedInside) {
				return;
			}

			if (e.currentTarget === e.target) {
				onClose();
			}
		}}
		transition:fade={{ duration: 100 }}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute flex h-full w-full items-center justify-center"
			onmousedown={() => {
				pressedInside = true;
			}}
		>
			{@render children()}
		</div>
	</div>
{/if}
