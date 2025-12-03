<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname, RouteId } from '$app/types';

	const {
		checked,
		first,
		second,
		firstHref,
		secondHref
	}: {
		checked: boolean;
		first: string;
		second: string;
		firstHref: RouteId | Pathname;
		secondHref: RouteId | Pathname;
	} = $props();
</script>

<a
	class="group relative flex h-full w-full shrink-0 rounded-full"
	href={resolve(checked ? firstHref : secondHref)}
>
	<div
		class="absolute top-0 h-full w-1/2 transform rounded-full bg-blue-500 duration-200"
		class:right-0={checked}
		class:translate-x-0={checked}
		class:right-full={!checked}
		class:translate-x-full={!checked}
	></div>

	<span
		class="absolute flex h-full w-1/2 items-center justify-center rounded-l-full text-center text-xs"
	>
		<span>{first}</span>
	</span>

	<span
		class="absolute left-1/2 flex h-full w-1/2 items-center justify-center rounded-r-full text-center text-xs"
	>
		<span>{second}</span>
	</span>
</a>
