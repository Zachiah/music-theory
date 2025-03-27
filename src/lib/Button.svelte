<script lang="ts">
	import type { Snippet } from "svelte";

	const { children, onClick }: { children: Snippet<[]>, onClick(): void } = $props();
</script>

<button class="bg-blue-500 px-4 py-2 rounded-md cursor-pointer" onclick={onClick}>
	{@render children()}
</button>
