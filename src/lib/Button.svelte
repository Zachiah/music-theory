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
		primary: 'cursor-pointer bg-blue-500',
		danger: 'cursor-pointer bg-red-500'
	};
	const disabledClassStyles = {
		primary: 'bg-blue-500/80 cursor-not-allowed text-gray-800',
		danger: 'bg-red-500/80 cursor-not-allowed text-gray-800'
	};
</script>

<button
	{disabled}
	class={`rounded-md px-4 py-2 ${disabled ? disabledClassStyles[style] : classStyles[style]}`}
	onclick={onClick}
>
	{@render children()}
</button>
