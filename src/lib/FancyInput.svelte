<script lang="ts">
	let { value = $bindable(), placeholder }: { value: string; placeholder: string } = $props();
</script>

<label class="group relative block min-w-24 flex-0 rounded-md dark:bg-slate-600">
	<p
		class="absolute left-3 transform text-gray-300 duration-200 group-focus-within:top-0.5 group-focus-within:translate-y-0 group-focus-within:text-xs dark:text-slate-300 {value
			? 'top-0.5 translate-y-0 text-xs'
			: 'top-1/2 -translate-y-1/2'}"
	>
		{placeholder}
	</p>
	<input class="h-full w-full rounded-md border-none bg-transparent" bind:value />
</label>
