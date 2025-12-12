<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, maxW }: { children: Snippet<[]>; maxW?: boolean } = $props();
</script>

<div class="p-8">
	<div
		class="bg-surface-1 relative mx-auto flex flex-col gap-4 rounded-md px-8 py-4"
		class:max-w-2xl={maxW}
	>
		{@render children()}
	</div>
</div>
