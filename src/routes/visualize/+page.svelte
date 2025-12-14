<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { createCpaHistoryState } from '$lib/cpaHistoryState.svelte';
	import { createCpaPlayState } from '$lib/cpaPlayState.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { findPitchForEventByKeybind, getFormattedKeybindForPitch } from '$lib/keyboardKeybinds';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import MovingNotesVisualization from '$lib/MovingNotesVisualization.svelte';
	import { PitchConstituents } from '$lib/PitchConstituents';
	import { playback } from '$lib/Playback';
	import { onMount, onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';

	const cpaPlayState = createCpaPlayState(playback);
	const cpaHistoryState = createCpaHistoryState(20000);
	const cpaState = createCpaState({
		onChange(change) {
			cpaPlayState.onCpaChangePlay(change);
			cpaHistoryState.onCpaChangeHistory(change);
		}
	});

	onMount(() => {
		midiAccess.requestAccess();
		return midiAccess.listen((e) => {
			const m = decodeMIDIMessage(e);

			if (m.tag === 'note-down') {
				cpaState.enable(m.pitch);
			}

			if (m.tag === 'note-up') {
				cpaState.disable(m.pitch);
			}
		});
	});

	const numWhiteNotes =
		PitchConstituents.letterBasedHeight('C', 8) - PitchConstituents.letterBasedHeight('A', 0) + 1;

	let wrapperWidth: number = $state(1000);
	let fullscreenWrapper: HTMLDivElement | null = null;
	let isFullscreen = $state(false);
	let showControls = $state(true);
	let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;

	const toggleFullscreen = async () => {
		if (typeof document === 'undefined') {
			return;
		}

		if (!document.fullscreenElement && fullscreenWrapper) {
			try {
				await fullscreenWrapper.requestFullscreen();
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

	if (typeof document !== 'undefined') {
		const onFullScreenChange = () => {
			isFullscreen = document.fullscreenElement === fullscreenWrapper;
		};
		document.addEventListener('fullscreenchange', onFullScreenChange);
		$effect(() => {
			return () => {
				document.removeEventListener('fullscreenchange', onFullScreenChange);
			};
		});
	}

	const handleMouseMove = () => {
		showControls = true;
		if (hideControlsTimeout) {
			clearTimeout(hideControlsTimeout);
		}
		hideControlsTimeout = setTimeout(() => {
			showControls = false;
		}, 2000);
	};

	onDestroy(() => {
		if (hideControlsTimeout) {
			clearTimeout(hideControlsTimeout);
		}
	});
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.metaKey) {
			return;
		}

		const keybind = findPitchForEventByKeybind(e);

		if (!keybind) {
			return;
		}

		e.preventDefault();

		if (e.repeat) {
			return;
		}

		cpaState.enable(keybind.canonicalPitch);
	}}
	onkeyup={(e) => {
		const keybind = findPitchForEventByKeybind(e);

		if (e.metaKey) {
			return;
		}

		if (!keybind) {
			return;
		}

		cpaState.disable(keybind.canonicalPitch);
	}}
	onmousemove={handleMouseMove}
/>

<Container>
	<div class="flex">
		<h1 class="text-4xl">Visualize</h1>
		<p>(Supports MIDI)</p>
	</div>

	<div class="bg-always-black relative rounded-md p-4" bind:this={fullscreenWrapper}>
		{#if showControls}
			<button
				class="hover:text-primary border-always-gray-medium bg-surface-2 absolute top-4 right-4 z-50 flex items-center justify-center rounded-md border p-2 transition-opacity"
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

		<div
			class="flex h-[calc(100vh-250px)] flex-col gap-4 overflow-auto"
			class:h-[calc(100vh-250px)]={!isFullscreen}
			class:h-[calc(100vh-20px)]={isFullscreen}
			bind:clientWidth={wrapperWidth}
		>
			<MovingNotesVisualization
				history={cpaHistoryState.cpaHistory}
				whiteKeyWidth={wrapperWidth / numWhiteNotes}
				start={{ pitchClass: 'A', octave: 0 }}
			/>

			<Keyboard
				whiteKeyWidth={wrapperWidth / numWhiteNotes}
				noteNumber={88}
				start={{ pitchClass: 'A', octave: 0 }}
				highlighted={cpaState.selected}
				onMouseDown={cpaState.enable}
				onMouseEnter={(p, pressed) => {
					if (pressed) {
						cpaState.enable(p);
					}
				}}
				onMouseUp={cpaState.disable}
				onMouseOut={cpaState.disable}
			>
				{#snippet renderKeyText(cp)}
					{@const keybind = getFormattedKeybindForPitch(cp)}

					<div class="flex flex-col">
						<span>{keybind}</span>
					</div>
				{/snippet}
			</Keyboard>
		</div>
	</div>
</Container>
