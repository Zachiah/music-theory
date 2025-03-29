<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet<[]> } = $props();
</script>

<div
	class="mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col gap-8 overflow-y-auto rounded-md bg-white p-8 shadow-lg"
>
	{@render children()}
</div>
