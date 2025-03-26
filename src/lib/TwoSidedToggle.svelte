<script lang="ts">
	const {
		checked,
		onChange,
		first,
		second
	}: {
		checked: boolean;
		onChange: (c: boolean) => void;
		first: string;
		second: string;
	} = $props();
</script>

<label class="group relative flex w-full h-full shrink-0 rounded-full">
	<div
		class="absolute top-0 right-full h-full w-1/2 translate-x-full transform rounded-full bg-blue-500 duration-200 group-has-checked:right-0 group-has-checked:translate-x-0"
	></div>

	<span
		class="absolute flex h-full w-1/2 items-center justify-center rounded-l-full text-center text-xs"
	>
		<span>{first}</span>
	</span>

	<input
		type="checkbox"
		class="opacity-0"
		{checked}
		onchange={(e) => {
			onChange(e.currentTarget.checked);
		}}
	/>

	<span
		class="absolute left-1/2 flex h-full w-1/2 items-center justify-center rounded-r-full text-center text-xs"
	>
		<span>{second}</span>
	</span>
</label>
