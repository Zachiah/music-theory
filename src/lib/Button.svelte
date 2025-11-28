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
		style?: 'danger' | 'primary' | 'neutral' | 'warning';
		disabled?: boolean;
	} = $props();

	const classStyles = {
		primary: 'cursor-pointer bg-blue-500',
		danger: 'cursor-pointer bg-red-500',
		warning: 'cursor-pointer bg-orange-500',
		neutral: 'cursor-pointer bg-gray-200 text-slate-800 dark:bg-slate-600 dark:text-white'
	};
	const disabledClassStyles = {
		primary: 'bg-blue-500/80 cursor-not-allowed text-gray-800',
		danger: 'bg-red-500/80 cursor-not-allowed text-gray-800',
		warning: 'bg-orange-500/80 cursor-note-allowed text-gray-800',
		neutral: 'bg-gray-200/80 cursor-not-allowed text-gray-800'
	};
</script>

<button
	{disabled}
	class={`rounded-md px-4 py-2 ${disabled ? disabledClassStyles[style] : classStyles[style]}`}
	onclick={onClick}
>
	{@render children()}
</button>
