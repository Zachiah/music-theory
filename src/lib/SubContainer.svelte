<script lang="ts" generics="T extends keyof HTMLElementTagNameMap | undefined">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type BaseProps = {
		children: Snippet;
		padding?: 'square' | 'text';
		class?: string;
	};
	type ExtraProps = T extends keyof HTMLElementTagNameMap
		? {
				el: T;
				attrs?: SvelteHTMLElements[T];
			}
		: {
				el?: undefined;
				attrs?: undefined;
			};

	type Props = BaseProps & ExtraProps;

	const {
		children,
		padding = 'square',
		class: className = '',
		el = 'div',
		attrs,
	}: Props = $props();
</script>

<svelte:element
	this={el}
	class="bg-surface-2 overflow-auto rounded-md {className}"
	class:p-4={padding === 'square'}
	class:py-2={padding === 'text'}
	class:px-4={padding === 'text'}
	{...attrs as object}
>
	{@render children()}
</svelte:element>
