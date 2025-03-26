<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';

	type FretboardString = {
		open: CanonicalPitch;
		frets: FretActivation[];
	};
	type FretActivation = 'neutral' | 'disabled' | 'active' | 'none';

	const {
		onClick,
		strings,
		flip
	}: {
		onClick: (string: number, fret: number) => void;
		strings: FretboardString[];
		flip: boolean;
	} = $props();

	const usableStrings = $derived.by(() => {
		const indexed = strings.map((s, idx) => ({ s, idx }));

		if (!flip) {
			return indexed;
		}

		return indexed.reverse();
	});
</script>

{#snippet fret(
	note: CanonicalPitch,
	noteActivation: 'neutral' | 'disabled' | 'active' | 'none',
	onClick: () => void
)}
	<button onclick={onClick} class="relative w-10 shrink-0 border-r-2 border-black">
		<div class="absolute top-1/2 h-1 w-full -translate-y-1/2 transform bg-black"></div>

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

{#snippet string(fs: FretboardString, idx: number)}
	<div class="flex h-8">
		{#each fs.frets as fretActivation, fretIdx}
			{@const pitch = CanonicalPitch.applyOffset(fs.open, fretIdx)}

			{@render fret(pitch, fretActivation, () => {
				onClick(idx, fretIdx);
			})}
		{/each}
	</div>
{/snippet}

<div>
	{#each usableStrings as { s, idx }}
		{@render string(s, idx)}
	{/each}
</div>
