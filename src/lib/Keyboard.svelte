<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import { Pitch } from './Pitch';

	const {
		start,
		noteNumber,
		activePitches,
		toggle,
		labels
	}: {
		start: CanonicalPitch;
		noteNumber: number;
		activePitches: { pitch: Pitch; extraText?: string }[];
		toggle: (pitch: CanonicalPitch) => void;
		labels: 'all' | 'selected' | 'none';
	} = $props();

	type NoteData = {
		pitch: CanonicalPitch;
		displayPitch?: Pitch;
		extraText?: string;
		blackKey: null | {
			pitch: CanonicalPitch;
			displayPitch?: Pitch;
			label: boolean;
			extraText?: string;
		};
		label: boolean;
	};

	if (start.pitchClass.endsWith('b')) {
		throw new Error('Keyboards must start with a white note as of now');
	}

	const noteData: NoteData[] = $derived(
		new Array(noteNumber).fill(null).reduce<NoteData[]>((acc, _, idx) => {
			const pitch = CanonicalPitch.applyOffset(start, idx);
			const displayPitchData = activePitches.find((p) => {
				const c = Pitch.toCanonical(p.pitch);
				return c.octave === pitch.octave && c.pitchClass === pitch.pitchClass;
			});

			const label = labels === 'selected' ? !!displayPitchData : labels === 'all' ? true : false;

			if (pitch.pitchClass.endsWith('b')) {
				return [
					...acc.slice(0, acc.length - 1),
					{
						...acc[acc.length - 1],
						blackKey: {
							displayPitch: displayPitchData?.pitch,
							extraText: displayPitchData?.extraText,
							pitch,
							label
						}
					}
				];
			}

			return [
				...acc,
				{
					pitch,
					blackKey: null,
					displayPitch: displayPitchData?.pitch,
					extraText: displayPitchData?.extraText,
					label
				}
			];
		}, [])
	);
</script>

<div class="overflow-auto rounded-md bg-gray-200 p-4 dark:bg-slate-600">
	<div class="flex w-min" style="--w: 20px; --h: 15px;">
		{#each noteData as { pitch, blackKey, displayPitch, label, extraText } (Pitch.print(Pitch.fromCanonical(pitch)))}
			<div class="relative h-[calc(15_*_var(--h))] w-[calc(2.4_*_var(--w))] shrink-0 grow-0">
				<button
					aria-label={`Toggle note ${Pitch.print(Pitch.fromCanonical(pitch))}`}
					class="flex h-full w-full items-end justify-center rounded-b-md border border-gray-600 pb-2 text-black"
					class:bg-blue-500={displayPitch}
					class:bg-white={!displayPitch}
					onclick={() => toggle(pitch)}
				>
					{#if label}
						<div class="flex flex-col">
							<span>{extraText}</span>
							<span>{Pitch.print(displayPitch || Pitch.fromCanonical(pitch))}</span>
						</div>
					{/if}
				</button>

				{#if blackKey}
					<button
						aria-label={`Toggle note ${Pitch.print(Pitch.fromCanonical(blackKey.pitch))}`}
						class="absolute top-0 right-0 z-20 flex h-[calc(9_*_var(--h))] w-[calc(1.4_*_var(--w))] translate-x-1/2 transform items-end justify-center rounded-b-md border-2 border-gray-600 pb-2 text-white"
						class:bg-black={!blackKey.displayPitch}
						class:bg-blue-500={!!blackKey.displayPitch}
						onclick={() => toggle(blackKey.pitch)}
					>
						{#if blackKey.label}
							<div class="flex flex-col">
								<span>{blackKey.extraText}</span>
								<span
									>{Pitch.print(blackKey.displayPitch || Pitch.fromCanonical(blackKey.pitch))}</span
								>
							</div>
						{/if}
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
