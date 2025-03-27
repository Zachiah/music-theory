<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		active,
		onToggle,
		children
	}: {
		active: boolean;
		onToggle: () => void;
		children: Snippet<[]>;
	} = $props();
</script>

<label
	class="relative rounded-md px-4 py-2 duration-200"
	class:bg-gray-300={!active}
	class:text-gray-600={!active}
	class:bg-blue-500={active}
	class:text-black={active}
>
	<input
		type="checkbox"
		checked={active}
		oninput={onToggle}
		class="absolute h-full w-full opacity-0"
	/>

	{@render children()}
</label>
