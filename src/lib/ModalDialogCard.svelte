<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet<[]> } = $props();
</script>

<div
	class="mx-4 flex max-h-[80vh] w-2xl max-w-full flex-col gap-8 overflow-y-auto rounded-md bg-white p-8 shadow-lg dark:bg-slate-800 dark:shadow-slate-800"
>
	{@render children()}
</div>
