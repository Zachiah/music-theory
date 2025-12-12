<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { resolve } from '$app/paths';
	import SubContainer from '$lib/SubContainer.svelte';

	type Game = { href: string; title: string; description: string };
	const games = [
		{
			href: '/games/sight-reading',
			title: 'Sight Reading',
			description: 'Practice reading clusters of random notes to sharpen your sight reading.'
		},
		{
			href: '/games/piano',
			title: 'Piano',
			description: 'Play a virtual piano using your keyboard or MIDI'
		}
	] as const satisfies Game[];
</script>

<Container>
	<h1 class="text-4xl">Music Theory Games</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each games as game (game.href)}
			<SubContainer
				el="a"
				class="flex flex-col gap-2"
				attrs={{
					href: resolve(game.href)
				}}
			>
				<h2 class="text-2xl">{game.title}</h2>
				<p>{game.description}</p>
			</SubContainer>
		{/each}
	</div>
</Container>
