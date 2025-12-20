<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';
	import Button from './Button.svelte';

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

			<Button
				style="neutral"
				attrs={{
					'aria-label': isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
				}}
				onClick={toggleFullscreen}
				icon={isFullscreen
					? 'icon-[heroicons--arrows-pointing-in] size-5'
					: 'icon-[heroicons--arrows-pointing-out] size-5'}
			/>
		</div>
	{/if}

	{@render children({ fullscreen: isFullscreen })}
</div>
