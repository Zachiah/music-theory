<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import type { Fretboard } from './Fretboard';

	type FretActivation = 'neutral' | 'disabled' | 'active' | 'none';

	const {
		onClick,
		vertical,
		fretboard,
		stringDecorations
	}: {
		onClick: (string: number, fret: number) => void;
		vertical: boolean;
		fretboard: Fretboard;
		stringDecorations: FretActivation[][];
	} = $props();

	const usableStrings = $derived.by(() => {
		const indexed = fretboard.strings.map((s, idx) => ({ s, idx }));

		if (vertical) {
			return indexed;
		}

		return indexed.reverse();
	});
</script>

{#snippet fret(
	note: CanonicalPitch,
	noteActivation: 'neutral' | 'disabled' | 'active' | 'none',
	onClick: () => void,
	thick: boolean
)}
	<button
		onclick={onClick}
		class="relative shrink-0"
		class:border-r-2={!thick && !vertical}
		class:border-r-8={thick && !vertical}
		class:border-b-2={!thick && vertical}
		class:border-b-8={thick && vertical}
		class:border-gray-400={!thick}
		class:border-stone-700={thick}
		class:w-10={!vertical}
		class:h-10={vertical}
	>
		<div
			class={`absolute transform bg-black ${vertical ? 'bottom-0 left-1/2 h-full w-1 -translate-x-1/2' : 'top-1/2 h-1 w-full -translate-y-1/2'}`}
		></div>

		{#if noteActivation !== 'none'}
			<div
				class="absolute top-1/2 left-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full text-xs"
				class:bg-gray-200={noteActivation === 'neutral' || noteActivation === 'disabled'}
				class:text-gray-600={noteActivation === 'disabled'}
				class:bg-blue-500={noteActivation === 'active'}
			>
				{CanonicalPitch.print(note)}
			</div>
		{/if}
	</button>
{/snippet}

{#snippet string(stringPitch: CanonicalPitch, idx: number)}
	<div class="flex" class:h-8={!vertical} class:w-8={vertical} class:flex-col={vertical}>
		{#each new Array(fretboard.frets).fill(null) as _, fretIdx}
			{@const pitch = CanonicalPitch.applyOffset(stringPitch, fretIdx)}
			{@const fretDecoration = stringDecorations[idx][fretIdx]}

			{@render fret(
				pitch,
				fretDecoration,
				() => {
					onClick(idx, fretIdx);
				},
				fretIdx === 0
			)}
		{/each}
	</div>
{/snippet}

<div class="flex" class:flex-col={!vertical}>
	{#each usableStrings as { s, idx }}
		{@render string(s, idx)}
	{/each}
</div>
