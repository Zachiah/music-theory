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
		<p class="text-red-500">{error}</p>
	{/if}

	<label class="group relative block h-13 min-w-24 flex-0 rounded-md dark:bg-slate-600">
		<p
			class="absolute left-3 transform text-gray-300 duration-200 group-focus-within:top-0.5 group-focus-within:translate-y-0 group-focus-within:text-xs dark:text-slate-300 {value
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
