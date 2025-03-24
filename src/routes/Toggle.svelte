<script lang="ts">
	import type { Snippet } from "svelte";

    const {
        active,
        onToggle,
        children,
    }: {
        active: boolean,
        onToggle: () => void,
        children: Snippet<[]>,
    } = $props()
</script>

<label
    class="relative px-4 py-2 rounded-full duration-200 text-xs"
    class:bg-gray-300={!active}
    class:text-gray-600={!active}
    class:bg-blue-500={active}
    class:text-black={active}
>
    <input
        type="checkbox"
        checked={active}
        oninput={onToggle}
        class="absolute w-full h-full opacity-0"
    />

    {@render children()}
</label>
