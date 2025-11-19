<script lang="ts">
	import { CanonicalPitch, CanonicalPitchArray } from './CanonicalPitch';

	const {
		start,
		noteNumber,
		activePitches,
		toggle,
		labels
	}: {
		start: CanonicalPitch;
		noteNumber: number;
		activePitches: CanonicalPitchArray;
		toggle: (pitch: CanonicalPitch) => void;
		labels: 'all' | 'selected' | 'none';
	} = $props();

	type NoteData = {
		pitch: CanonicalPitch;
		blackKey: null | {
			pitch: CanonicalPitch;
			selected: boolean;
			label: boolean;
		};
		selected: boolean;
		label: boolean;
	};

	if (start.pitchClass.endsWith('b')) {
		throw new Error('Keyboards must start with a white note as of now');
	}

	const noteData: NoteData[] = $derived(
		new Array(noteNumber).fill(null).reduce<NoteData[]>((acc, _, idx) => {
			const pitch = CanonicalPitch.applyOffset(start, idx);
			const selected = !!activePitches.find(
				(p) => p.octave === pitch.octave && p.pitchClass === pitch.pitchClass
			);

			const label = labels === 'selected' ? selected : labels === 'all' ? true : false;

			if (pitch.pitchClass.endsWith('b')) {
				return [
					...acc.slice(0, acc.length - 1),
					{
						...acc[acc.length - 1],
						blackKey: { selected, pitch, label }
					}
				];
			}

			return [
				...acc,
				{
					pitch,
					blackKey: null,
					selected,
					// TODO:
					label
				}
			];
		}, [])
	);
</script>

<div class="overflow-auto rounded-md bg-gray-200 p-4 dark:bg-slate-600">
	<div class="flex w-min" style="--w: 20px; --h: 15px;">
		{#each noteData as { pitch, blackKey, selected, label } (CanonicalPitch.print(pitch))}
			<div class="relative h-[calc(15_*_var(--h))] w-[calc(2.4_*_var(--w))] shrink-0 grow-0">
				<button
					aria-label={`Toggle note ${CanonicalPitch.print(pitch)}`}
					class="flex h-full w-full items-end justify-center rounded-b-md border border-gray-600 pb-2 text-black"
					class:bg-blue-500={selected}
					class:bg-white={!selected}
					onclick={() => toggle(pitch)}
				>
					{#if label}
						{CanonicalPitch.print(pitch)}
					{/if}
				</button>

				{#if blackKey}
					<button
						aria-label={`Toggle note ${CanonicalPitch.print(blackKey.pitch)}`}
						class="absolute top-0 right-0 z-20 flex h-[calc(9_*_var(--h))] w-[calc(1.4_*_var(--w))] translate-x-1/2 transform items-end justify-center rounded-b-md border-2 border-gray-600 pb-2 text-white"
						class:bg-black={!blackKey.selected}
						class:bg-blue-500={blackKey.selected}
						onclick={() => toggle(blackKey.pitch)}
					>
						{#if blackKey.label}
							{CanonicalPitch.print(blackKey.pitch)}
						{/if}
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
