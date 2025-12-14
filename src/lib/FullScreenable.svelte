<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type SlotProps = {
		fullscreen: boolean;
	};

	type Props = {
		children: Snippet<[SlotProps]>;
		actions?: Snippet<[SlotProps]>;
	};

	const { children, actions }: Props = $props();

	let wrapper: HTMLDivElement | null = null;
	let isFullscreen = $state(false);
	let showControls = $state(true);
	let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
	let isHoveringControls = false;

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
			if (!isHoveringControls) {
				showControls = false;
			}
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
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute top-4 right-4 z-50 flex items-center gap-2"
			transition:fade={{ duration: 150 }}
			onmouseenter={() => {
				isHoveringControls = true;
				showControls = true;
				if (hideControlsTimeout) {
					clearTimeout(hideControlsTimeout);
				}
			}}
			onmouseleave={() => {
				isHoveringControls = false;
				scheduleHide();
			}}
		>
			{#if actions}
				{@render actions({ fullscreen: isFullscreen })}
			{/if}

			<button
				class="hover:text-primary border-always-gray-medium bg-surface-2 flex items-center justify-center rounded-md border p-2"
				aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
				onclick={toggleFullscreen}
			>
				<span
					class={isFullscreen
						? 'icon-[heroicons--arrows-pointing-in] size-5'
						: 'icon-[heroicons--arrows-pointing-out] size-5'}
				></span>
			</button>
		</div>
	{/if}

	{@render children({ fullscreen: isFullscreen })}
</div>
