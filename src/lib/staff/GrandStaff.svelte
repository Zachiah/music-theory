<script lang="ts">
	import type { Pitch } from '$lib/Pitch';
	import { PitchConstituents } from '$lib/PitchConstituents';
	import BassCleff from './BassCleff.svelte';
	import TrebleCleff from './TrebleCleff.svelte';
	import {
		BASS_BOTTOM_POS,
		filterPitchesInRange,
		getAlignment,
		getVisibleLinePoses,
		STAFF_HIGH,
		STAFF_LOW,
		STAFF_LOW_POS,
		STAFF_SIZE,
		TREBLE_BOTTOM_POS
	} from './staffUtil';
	import WholeNote from './WholeNote.svelte';

	const { notes }: { notes: Pitch[] } = $props();

	const visiblePitches = $derived(filterPitchesInRange(notes, STAFF_LOW, STAFF_HIGH));

	const pitchesWithAlignment = $derived(getAlignment(visiblePitches));

	const usablePitches = $derived(
		pitchesWithAlignment.map(({ pitch, alignment, natural }) => {
			const letterHeight = PitchConstituents.letterBasedHeight(
				pitch.pitchClass.letter,
				pitch.octave
			);

			return { letterHeight, pitch, natural, alignment };
		})
	);

	const linePoses = $derived(getVisibleLinePoses(notes));
</script>

<div
	class="wrapper"
	style="
			--staff-size: {STAFF_SIZE};
			--bass-bottom-pos: {BASS_BOTTOM_POS - STAFF_LOW_POS};
			--treble-bottom-pos: {TREBLE_BOTTOM_POS - STAFF_LOW_POS};
		"
>
	<div class="bass-cleff-wrapper">
		<BassCleff />
	</div>

	<div class="treble-cleff-wrapper">
		<TrebleCleff />
	</div>

	{#each linePoses as { pos, full } (pos)}
		<div class="staff-line" class:full style="--pos: {pos - STAFF_LOW_POS}"></div>
	{/each}

	{#each usablePitches as { pitch, letterHeight, alignment, natural } (pitch)}
		<div
			class="note-wrapper"
			style="--pos: {letterHeight - STAFF_LOW_POS}; --alignment: {alignment};"
		>
			<div class="note-modifier">
				{PitchConstituents.printModifiers(pitch.pitchClass.modifier)}
				{#if natural}♮{/if}
			</div>
			<WholeNote />
		</div>
	{/each}
</div>

<style>
	div {
		position: absolute;
		transform: translate(0%, 50%);
	}

	.wrapper {
		--note-head-height: 10px;
		--full-width: 150px;
		--mult-pos: calc(var(--note-head-height) / 2);

		position: relative;
		transform: none;
		width: var(--full-width);
		height: calc(var(--staff-size) * var(--mult-pos));
	}

	.bass-cleff-wrapper {
		transform: none;
		bottom: calc(var(--bass-bottom-pos) * var(--mult-pos) + var(--note-head-height) * 0.95);
		height: calc(var(--note-head-height) * 3);
	}

	.treble-cleff-wrapper {
		transform: none;
		bottom: calc(var(--treble-bottom-pos) * var(--mult-pos) - var(--note-head-height) * 1.2);
		height: calc(var(--note-head-height) * 6);
	}

	.staff-line {
		background: currentColor;
		bottom: calc(var(--pos) * var(--mult-pos));
		height: 1px;
		left: calc(var(--note-head-height) * 3.5);
		width: calc(var(--note-head-height) * 3);
	}

	.staff-line.full {
		left: 0;
		width: var(--full-width);
	}

	.note-wrapper {
		transform: translate(-50%, 50%);
		bottom: calc(var(--pos) * var(--mult-pos));
		left: calc(5 * var(--note-head-height) + 1.5 * var(--alignment) * var(--note-head-height));
		height: var(--note-head-height);
		border-radius: 50%;
	}

	.note-modifier {
		left: -60%;
		bottom: calc(var(--note-head-height) / 2);
		line-height: 1;
		font-size: calc(var(--note-head-height) * 2);
	}
</style>
