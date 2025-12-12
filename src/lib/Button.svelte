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
		primary: 'cursor-pointer bg-primary',
		danger: 'cursor-pointer bg-danger',
		warning: 'cursor-pointer bg-warning',
		neutral: 'cursor-pointer bg-surface-2'
	};
	const disabledClassStyles = {
		primary: 'bg-primary/80 cursor-not-allowed text-text-disabled',
		danger: 'bg-danger/80 cursor-not-allowed text-text-disabled',
		warning: 'bg-warning/80 cursor-not-allowed text-text-disabled',
		neutral: 'bg-surface-2/80 cursor-not-allowed text-text-disabled'
	};
</script>

<button
	{disabled}
	class={`rounded-md px-4 py-2 text-inherit ${disabled ? disabledClassStyles[style] : classStyles[style]}`}
	onclick={onClick}
>
	{@render children()}
</button>
