<script lang="ts">
	import { resolve } from '$app/paths';
	import '../app.css';
	let { children } = $props();
</script>

<nav>
	<ul class="bg-surface-1 flex">
		<li class="contents"><a class="hover:text-primary p-4" href={resolve('/')}>Home</a></li>
		<li class="contents">
			<a class="hover:text-primary p-4" href={resolve('/scale-info')}>Scale Info</a>
		</li>
		<li class="contents">
			<a class="hover:text-primary p-4" href={resolve('/chord-identifier/keyboard')}>Identify</a>
		</li>
		<li class="contents">
			<a class="hover:text-primary p-4" href={resolve('/games')}>Games</a>
		</li>

		<span class="grow"></span>

		<li class="contants">
			<a
				class="hover:text-primary flex h-full items-center justify-center p-4"
				href="https://github.com/Zachiah/music-theory"
				aria-label="GitHub"
			>
				<span class="icon-[octicon--mark-github-16] size-6"></span>
			</a>
		</li>
	</ul>
</nav>

{@render children()}
