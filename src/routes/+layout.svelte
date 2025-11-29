<script lang="ts">
	import { resolve } from '$app/paths';
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<ul class="flex bg-gray-200 dark:bg-slate-600">
		<li class="contents"><a class="p-4 hover:text-blue-500" href={resolve('/')}>Home</a></li>
		<li class="contents">
			<a class="p-4 hover:text-blue-500" href={resolve('/scale-info')}>Scale Info</a>
		</li>
		<li class="contents">
			<a class="p-4 hover:text-blue-500" href={resolve('/chord-identifier/keyboard')}>Identify</a>
		</li>
		<li class="contents">
			<a class="p-4 hover:text-blue-500" href={resolve('/games')}>Games</a>
		</li>

		<span class="flex-grow"></span>

		<li class="contants">
			<a
				class="flex h-full items-center justify-center p-4 hover:text-blue-500"
				href="https://github.com/Zachiah/music-theory"
				aria-label="GitHub"
			>
				<span class="icon-[octicon--mark-github-16] size-6"></span>
			</a>
		</li>
	</ul>
</nav>

{@render children()}
