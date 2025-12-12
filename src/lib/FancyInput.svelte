<script lang="ts">
	let {
		value = $bindable(),
		placeholder,
		error,
		forceShowError
	}: { value: string; placeholder: string; error?: string; forceShowError?: boolean } = $props();

	let blurred = $state(false);

	let showError = $derived(blurred || forceShowError);
</script>

<div class="flex flex-col gap-2">
	{#if error && showError}
		<p class="text-warning">{error}</p>
	{/if}

	<label class="group bg-surface-2 relative block h-13 min-w-24 flex-0 rounded-md">
		<p
			class="text-text-placeholder absolute left-3 transform duration-200 group-focus-within:top-0.5 group-focus-within:translate-y-0 group-focus-within:text-xs {value
				? 'top-0.5 translate-y-0 text-xs'
				: 'top-1/2 -translate-y-1/2'}"
		>
			{placeholder}
		</p>
		<input
			onblur={() => {
				blurred = true;
			}}
			class="h-13 w-full rounded-md border-none bg-transparent"
			bind:value
			aria-invalid={error && showError ? 'true' : 'false'}
		/>
	</label>
</div>
