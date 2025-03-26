<script lang="ts">
	import type { Snippet } from "svelte";

    const {children, maxW}: {children: Snippet<[]>, maxW?: boolean} = $props()
</script>

<div class="p-8">
    <div class="mx-auto flex flex-col gap-4" class:max-w-2xl={maxW}>
        {@render children()}
    </div>
</div>
