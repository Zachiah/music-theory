<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type SlotProps = {
		fullscreen: boolean;
	};

	type Props = {
		children: Snippet<[SlotProps]>;
	};

	const { children }: Props = $props();

	let wrapper: HTMLDivElement | null = null;
	let isFullscreen = $state(false);
	let showControls = $state(true);
	let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;

	const toggleFullscreen = async () => {
		if (!document.fullscreenElement && wrapper) {
			try {
				await wrapper.requestFullscreen();
			} catch {
				/* ignore */
			}
			return;
		}

		if (document.fullscreenElement) {
			try {
				await document.exitFullscreen();
			} catch {
				/* ignore */
			}
		}
	};

	const scheduleHide = () => {
		if (hideControlsTimeout) {
			clearTimeout(hideControlsTimeout);
		}
		hideControlsTimeout = setTimeout(() => {
			showControls = false;
		}, 2000);
	};

	const handleMouseMove = () => {
		showControls = true;
		scheduleHide();
	};

	$effect(() => {
		const onFullScreenChange = () => {
			isFullscreen = document.fullscreenElement === wrapper;
			if (isFullscreen) {
				showControls = true;
				scheduleHide();
			}
		};

		document.addEventListener('fullscreenchange', onFullScreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', onFullScreenChange);
		};
	});

	$effect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		window.addEventListener('mousemove', handleMouseMove);
		scheduleHide();
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			if (hideControlsTimeout) {
				clearTimeout(hideControlsTimeout);
			}
		};
	});
</script>

<div class="relative" bind:this={wrapper}>
	{#if showControls}
		<button
			class="hover:text-primary border-always-gray-medium bg-surface-2 absolute top-4 right-4 z-50 flex items-center justify-center rounded-md border p-2"
			aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
			onclick={toggleFullscreen}
			transition:fade={{ duration: 150 }}
		>
			<span
				class={isFullscreen
					? 'icon-[heroicons--arrows-pointing-in] size-5'
					: 'icon-[heroicons--arrows-pointing-out] size-5'}
			></span>
		</button>
	{/if}

	{@render children({ fullscreen: isFullscreen })}
</div>
