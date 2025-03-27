<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, onClick }: { children: Snippet<[]>; onClick(): void } = $props();
</script>

<button class="cursor-pointer rounded-md bg-blue-500 px-4 py-2" onclick={onClick}>
	{@render children()}
</button>
