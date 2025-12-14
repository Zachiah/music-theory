<script lang="ts">
	import Container from '$lib/Container.svelte';
</script>

<Container>
	<h1 class="text-4xl">Music Theory</h1>

	<p>This site has some tools I made to help with music theory. Please use the nav menu above!</p>

	<section class="mt-4">
		<h2 class="text-2xl">Contributing &amp; feedback</h2>
		<p class="mb-3">
			I'd love bug reports, feature ideas, questions of any kind. Feel free to <a
				href="https://github.com/Zachiah/music-theory/issues/new"
				class="text-primary">open an issue on GitHub</a
			>, or email me at
			<a href="mailto:zachiah@proton.me" class="text-primary">zachiah@proton.me</a>.
		</p>
		<p>
			Tech stack: TypeScript, SvelteKit, Tailwind. I'm trying to keep the number of libraries used
			to a minimum.
		</p>
	</section>

	<p class="text-right">
		Made by <a class="text-primary" href="https://zachiah.com/">Zachiah Sawyer</a>
	</p>
</Container>
