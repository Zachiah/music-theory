<script lang="ts" module>
	export const vizThemes = ['bw', 'rainbow', 'fire'] as const;
	export type VizThemeName = (typeof vizThemes)[number];
</script>

<script lang="ts">
	import type { CanonicalPitch } from './CanonicalPitch';
	import type { CpaHistoryItem } from './cpaHistoryState.svelte';
	import { musicDisplayOptions } from './musicDisplayOptionsState.svelte';
	import { Pitch } from './Pitch';
	import { PitchClass } from './PitchClass';
	import { PitchConstituents } from './PitchConstituents';
	import { createTickerState } from './tickerState.svelte';

	const tickerState = createTickerState(10);

	const {
		history,
		start: startNote,
		whiteKeyWidth,
		themeName
	}: {
		history: CpaHistoryItem[];
		start: CanonicalPitch;
		whiteKeyWidth: number;
		themeName: VizThemeName;
	} = $props();

	const minStart = $derived(Math.min(...history.map((h) => h.start), tickerState.tick));

	let availableElementHeight = $state(1000);

	const SPEED = 1 / 20;

	type ThemeStyle = { classes: string; styles: string };

	const themeStyles: { [key in VizThemeName]: (item: CpaHistoryItem) => ThemeStyle } = {
		bw: (item) => {
			const flat = item.pitch.pitchClass.endsWith('b');

			const flatBased = flat ? 'from-always-black' : 'from-always-white';

			return {
				classes: `${flatBased} to-transparent bg-linear-to-tr border border-always-white`,
				styles: ''
			};
		},
		rainbow: (item) => {
			const rainbowColors = [
				'#FF0000',
				'#FF7F00',
				'#FFFF00',
				'#00FF00',
				'#0000FF',
				'#4B0082',
				'#8B00FF'
			];
			return {
				classes: 'from-(--b) to-always-white bg-linear-to-tr',
				styles: `--b: ${rainbowColors[item.start % rainbowColors.length]}`
			};
		},
		fire: (item) => {
			const fireColors = ['#FF4500', '#FF8C00', '#FFFF00'];
			return {
				classes: 'from-warning via-danger via-30% to-transparent bg-linear-to-tr',
				styles: `--b: ${fireColors[item.start % fireColors.length]}`
			};
		}
	};
</script>

<div class="relative grow overflow-hidden" bind:clientHeight={availableElementHeight}>
	<div
		class="absolute left-0 h-full w-full"
		style="bottom: {(tickerState.tick - minStart) * SPEED}px;"
	>
		{#each history as item (`${item.start}${Pitch.print(Pitch.fromCanonical(item.pitch), musicDisplayOptions.data)}`)}
			{@const flat = item.pitch.pitchClass.endsWith('b')}
			{@const absoluteLetterHeight = PitchConstituents.letterBasedHeight(
				PitchClass.fromCanonicalPitchClass(item.pitch.pitchClass).letter,
				item.pitch.octave
			)}
			{@const c2LetterHeight = PitchConstituents.letterBasedHeight(
				startNote.pitchClass as PitchConstituents.LetterName,
				startNote.octave
			)}
			{@const letterHeight = absoluteLetterHeight - c2LetterHeight}

			{@const moveOver = letterHeight - (flat ? 0.5 : 0)}

			{@const start = item.start - minStart}
			{@const end = item.end ? item.end - minStart : tickerState.tick - minStart}
			{@const length = end - start}

			{@const outOfView = (tickerState.tick - minStart - end) * SPEED > availableElementHeight}

			{#if !outOfView}
				{@const c = themeStyles[themeName](item)}
				<div
					class="absolute flex items-center justify-center"
					style="width: {whiteKeyWidth}px; bottom: -{(start + length) * SPEED}px; height: {length *
						SPEED}px; left: {moveOver * whiteKeyWidth}px"
				>
					<div
						class="h-full translate-y-[5px] transform rounded-md {c.classes}"
						style={c.styles}
						class:w-[48px]={!flat}
						class:w-[28px]={flat}
					></div>
				</div>
			{/if}
		{/each}
	</div>

	<div
		class="from-always-black/0 to-always-black absolute top-0 left-0 h-full w-full bg-linear-to-t"
	></div>
</div>
