<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Container from '$lib/Container.svelte';
</script>

<Container>
	<div class="flex flex-col items-center justify-center gap-4 p-8">
		<h1 class="text-4xl">{page.status} {page.error?.message}</h1>
		<p class="text-2xl">
			<a href={resolve('/games/piano')} class="text-blue-400">Play a piano with your keyboard</a>
		</p>
	</div>
</Container>
