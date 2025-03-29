<script lang="ts">
	import { PitchConstituents } from '$lib/PitchConstituents';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';

	const {
		notes,
		start,
		toggle
	}: {
		notes: boolean[];
		start: PitchConstituents.LetterName;
		toggle: (idx: number) => void;
	} = $props();

	type NoteData = {
		idx: number;
		letterName: PitchConstituents.LetterName;
		blackKey: null | {
			pitch: CanonicalPitchClass.CanonicalPitchClass;
			selected: boolean;
			idx: number;
		};
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
					idx
				}
			];
		}, [])
	);
</script>

<div class="overflow-auto rounded-md bg-gray-200 p-4 dark:bg-slate-600">
	<div class="flex w-min" style="--w: 20px; --h: 15px;">
		{#each noteData as { letterName, blackKey, selected, idx }}
			<div class="relative h-[calc(15_*_var(--h))] w-[calc(2.4_*_var(--w))] shrink-0 grow-0">
				<button
					aria-label={`Toggle note ${letterName}`}
					class="h-full w-full rounded-b-md border border-gray-600"
					class:bg-blue-500={selected}
					class:bg-white={!selected}
					onclick={() => toggle(idx)}
				>
				</button>

				{#if blackKey}
					<button
						aria-label={`Toggle note ${blackKey.pitch}`}
						class="absolute top-0 z-20 h-[calc(9_*_var(--h))] w-[calc(1.4_*_var(--w))] -translate-x-1/2 transform rounded-b-md border-2 border-gray-600"
						class:bg-black={!blackKey.selected}
						class:bg-blue-500={blackKey.selected}
						onclick={() => toggle(blackKey.idx)}
					></button>
				{/if}
			</div>
		{/each}
	</div>
</div>
