<script lang="ts">
	import { PitchConstituents } from '$lib/PitchConstituents';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';

	const {
		notes,
		start,
		toggle,
	}: {
		notes: boolean[];
		start: PitchConstituents.LetterName;
		toggle: (idx: number) => void
	} = $props();

	type NoteData = {
		idx: number;
		letterName: PitchConstituents.LetterName;
		blackKey: null | { pitch: CanonicalPitchClass.CanonicalPitchClass; selected: boolean, idx: number };
		selected: boolean;
	};

	const noteData: NoteData[] = $derived(
		notes.reduce<NoteData[]>((acc, selected, idx) => {
			const pitch = CanonicalPitchClass.applyOffset(start, idx);

			if (pitch.endsWith('b')) {
				return [
					...acc.slice(0, acc.length - 1),
					{
						...acc[acc.length - 1],
						blackKey: { selected, pitch, idx }
					}
				];
			}

			return [
				...acc,
				{
					letterName: pitch as PitchConstituents.LetterName,
					blackKey: null,
					selected,
					idx,
				}
			];
		}, [])
	);
</script>

<div class="flex">
	{#each noteData as { letterName, blackKey, selected, idx }}
		<div class="relative h-24 w-10">
			<button
				aria-label={`Toggle note ${letterName}`}
				class="h-24 w-10 border border-black"
				class:bg-blue-500={selected}
				onclick={() => toggle(idx)}
			>
			</button>

			{#if blackKey}
				<button
					aria-label={`Toggle note ${blackKey.pitch}`}
					class="absolute top-0 -right-4 h-16 w-8 border border-black z-20"
					class:bg-black={!blackKey.selected}
					class:bg-blue-500={blackKey.selected}
					onclick={() => toggle(blackKey.idx)}
				></button>
			{/if}
		</div>
	{/each}
</div>
