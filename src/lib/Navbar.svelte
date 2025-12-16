<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import { fade } from 'svelte/transition';

	const primaryLinks: { href: RouteId; label: string }[] = [
		{ href: '/', label: 'Home' },
		{ href: '/scale-info', label: 'Scale Info' },
		{ href: '/chord-identifier/keyboard', label: 'Identify' },
		{ href: '/games', label: 'Games' },
		{ href: '/visualize', label: 'Visualize' },
		{ href: '/chord-lookup', label: 'Chord Lookup' }
	];

	let mobileMenuOpen = $state(false);
</script>

<nav class="bg-surface-1 relative">
	<div class="flex w-full flex-wrap items-center gap-2 md:flex-nowrap">
		<button
			class="hover:text-primary flex h-full cursor-pointer items-center p-4 md:hidden"
			aria-label="Toggle navigation menu"
			aria-expanded={mobileMenuOpen}
			onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
		>
			<span
				class={mobileMenuOpen
					? 'icon-[heroicons--x-mark] size-6'
					: 'icon-[heroicons--bars-3] size-6'}
			></span>
		</button>

		<ul class="hidden flex-wrap md:flex">
			{#each primaryLinks as link (link.href)}
				<li class="contents">
					<a class="hover:text-primary p-4" href={resolve(link.href)}>{link.label}</a>
				</li>
			{/each}
		</ul>

		<span class="grow"></span>

		<ul class="flex items-center">
			<li class="contents">
				<a class="hover:text-primary p-4" href={resolve('/about')}>About</a>
			</li>
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
	</div>

	{#if mobileMenuOpen}
		<ul
			class="border-surface-2 bg-surface-1 absolute top-full right-0 left-0 z-40 flex flex-col border-t md:hidden"
			transition:fade={{ duration: 150 }}
		>
			{#each primaryLinks as link (link.href)}
				<li>
					<a
						class="hover:text-primary border-surface-2 block border-b p-4 last:border-b-0"
						href={resolve(link.href)}
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>
