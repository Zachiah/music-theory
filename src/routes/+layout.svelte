<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<ul class="flex bg-gray-200 dark:bg-slate-600">
		<li class="contents"><a class="p-4 hover:text-blue-500" href="/">Home</a></li>
		<li class="contents"><a class="p-4 hover:text-blue-500" href="/chord-scale-info">Info</a></li>
		<li class="contents">
			<a class="p-4 hover:text-blue-500" href="/chord-identifier/keyboard">Identify</a>
		</li>

		<span class="flex-grow"></span>

		<li class="contants">
			<a class="flex h-full items-center justify-center p-4 hover:text-blue-500" href="https://github.com/Zachiah/music-theory" aria-label="GitHub">
				<span class="size-6 icon-[octicon--mark-github-16]"></span>
			</a>
		</li>
	</ul>
</nav>

{@render children()}
