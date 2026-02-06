<script lang="ts">
	import Container from '$lib/Container.svelte';
	import SEO from '$lib/SEO.svelte';
</script>

<SEO title="About music-theory.zachiah.com" />

<Container>
	<h1 class="text-4xl">Music Theory</h1>

	<section class="mt-4">
		<h2 class="text-2xl font-semibold">Contributing &amp; feedback</h2>
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

	<section class="mt-4">
		<h2 class="text-2xl font-semibold">Project License</h2>
		<p class="mb-4">This project is released under the MIT License:</p>
		<pre class="bg-surface-2 overflow-auto rounded-md p-4 text-sm">
MIT License

Copyright (c) 2025 Zachiah Sawyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</pre>
	</section>

	<section class="mt-6">
		<h2 class="text-2xl font-semibold">Soundfont Attribution</h2>
		<p class="mb-2">
			The bundled piano soundfont <strong>Florestan_Piano</strong> was created by
			<a
				class="text-primary underline"
				href="https://web.archive.org/web/20160308061905/http://nando.oui.com.br/pages/soundfonts.html"
				target="_blank"
				rel="noopener noreferrer">Nando Florestan</a
			>
			and released into the public domain.
		</p>
		<p>Huge thanks to the author for making high-quality samples freely available.</p>
	</section>

	<p class="mt-8 text-right">
		Made by <a class="text-primary" href="https://zachiah.com/">Zachiah Sawyer</a>
	</p>
</Container>
