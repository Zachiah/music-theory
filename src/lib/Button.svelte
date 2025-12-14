<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		icon,
		onClick,
		style = 'primary',
		disabled = false,
		attrs = {}
	}: {
		children?: Snippet<[]>;
		icon?: string;
		onClick(): void;
		style?: 'danger' | 'primary' | 'neutral' | 'warning';
		disabled?: boolean;
		attrs?: HTMLButtonAttributes;
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
	class={`relative flex-none rounded-md text-inherit ${disabled ? disabledClassStyles[style] : classStyles[style]}`}
	onclick={onClick}
	class:py-2={!icon}
	class:px-4={!icon}
	class:size-13={icon}
	{...attrs}
>
	{#if icon}
		<span
			class="{icon} absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transform"
		></span>
	{/if}
	{@render children?.()}
</button>
