<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet<[]> } = $props();
</script>

<div
	class="bg-surface-1 mx-4 flex max-h-[80vh] w-2xl max-w-full flex-col gap-8 overflow-y-auto rounded-md p-8 shadow-lg"
>
	{@render children()}
</div>
