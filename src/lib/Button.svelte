<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children,
		onClick,
		style = 'primary',
		disabled = false
	}: {
		children: Snippet<[]>;
		onClick(): void;
		style?: 'danger' | 'primary';
		disabled?: boolean;
	} = $props();

	const classStyles = {
		primary: 'bg-blue-500',
		danger: 'bg-red-500'
	};
</script>

<button
	{disabled}
	class={`cursor-pointer rounded-md px-4 py-2 ${classStyles[style]}`}
	onclick={onClick}
>
	{@render children()}
</button>
