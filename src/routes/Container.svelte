<script lang="ts">
	import type { Snippet } from "svelte";

    const {children}: {children: Snippet<[]>} = $props()
</script>

<div class="mx-auto flex max-w-2xl flex-col gap-4 py-4">
    {@render children()}
</div>
