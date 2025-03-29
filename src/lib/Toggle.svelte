<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		title = '',
		active,
		onToggle,
		children
	}: {
		title?: string;
		active: boolean;
		onToggle: () => void;
		children: Snippet<[]>;
	} = $props();
</script>

<label
	class="relative rounded-md px-4 py-2 duration-200 dark:text-white"
	class:bg-gray-300={!active}
	class:text-gray-600={!active}
	class:dark:bg-slate-600={!active}
	class:bg-blue-500={active}
	class:text-black={active}
	aria-label={title}
	{title}
>
	<input
		type="checkbox"
		checked={active}
		oninput={onToggle}
		class="absolute top-1/2 left-1/2 h-0 w-0 opacity-0"
	/>

	{@render children()}
</label>
