<script lang="ts">
	import type { CpaHistoryItem } from './cpaHistoryState.svelte';
	import { Pitch } from './Pitch';
	import { PitchClass } from './PitchClass';
	import { PitchConstituents } from './PitchConstituents';
	import { createTickerState } from './tickerState.svelte';

	const tickerState = createTickerState(10);

	const { history }: { history: CpaHistoryItem[] } = $props();

	const minStart = $derived(Math.min(...history.map((h) => h.start), tickerState.tick));

	let availableElementHeight = $state(1000);

	const SPEED = 1 / 20;
</script>

<div class="relative h-96 overflow-hidden" bind:clientHeight={availableElementHeight}>
	<div
		class="absolute top-0 left-0 h-full w-full"
		style="top: {(tickerState.tick - minStart) * SPEED}px;"
	>
		{#each history as item (`${item.start}${Pitch.print(Pitch.fromCanonical(item.pitch))}`)}
			{@const flat = item.pitch.pitchClass.endsWith('b')}
			{@const absoluteLetterHeight = PitchConstituents.letterBasedHeight(
				PitchClass.fromCanonicalPitchClass(item.pitch.pitchClass).letter,
				item.pitch.octave
			)}
			{@const c2LetterHeight = PitchConstituents.letterBasedHeight('C', 2)}
			{@const letterHeight = absoluteLetterHeight - c2LetterHeight}

			{@const moveOver = letterHeight - (flat ? 0.5 : 0)}

			{@const start = item.start - minStart}
			{@const end = item.end ? item.end - minStart : tickerState.tick - minStart}
			{@const length = end - start}

			{@const outOfView = (tickerState.tick - minStart - end) * SPEED > availableElementHeight}

			{#if !outOfView}
				<div
					class="absolute flex w-[48px] items-center justify-center"
					style="top: -{(start + length) * SPEED}px; height: {length * SPEED}px; left: {moveOver *
						48}px"
				>
					<div
						class="h-full rounded-md bg-linear-to-br to-transparent"
						class:from-always-white={!flat}
						class:from-always-black={flat}
						class:w-[48px]={!flat}
						class:w-[28px]={flat}
					></div>
				</div>
			{/if}
		{/each}
	</div>

	<div
		class="from-surface-2/0 to-surface-2 absolute top-0 left-0 h-full w-full bg-linear-to-b"
	></div>
</div>
