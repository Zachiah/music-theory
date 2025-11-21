<script lang="ts">
	let { value = $bindable(), placeholder }: { value: string; placeholder: string } = $props();
</script>

<label class="group relative flex-1 rounded-md dark:bg-slate-600">
	<p
		class="absolute left-3 transform text-gray-300 group-focus-within:top-0.5 group-focus-within:translate-y-0 group-focus-within:text-xs dark:text-slate-300 {value
			? 'top-0.5 translate-y-0 text-xs'
			: 'top-1/2 -translate-y-1/2'}"
	>
		{placeholder}
	</p>
	<input class="h-full rounded-md bg-transparent" bind:value />
</label>
