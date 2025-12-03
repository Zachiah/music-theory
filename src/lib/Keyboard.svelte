<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import { Pitch } from './Pitch';

	const {
		start,
		noteNumber,
		pitchData,
		onMouseDown,
		onMouseUp,
		onClick,
		onMouseOut,
		onMouseEnter
	}: {
		start: CanonicalPitch;
		noteNumber: number;
		pitchData: {
			canonicalPitch: CanonicalPitch;
			pitch?: Pitch;
			extraText?: string;
			highlighted?: boolean;
			labeled?: boolean;
		}[];
		onMouseDown?: (pitch: CanonicalPitch) => void;
		onMouseUp?: (pitch: CanonicalPitch) => void;
		onClick?: (pitch: CanonicalPitch) => void;
		onMouseOut?: (pitch: CanonicalPitch) => void;
		onMouseEnter?: (pitch: CanonicalPitch, mousePressed: boolean) => void;
	} = $props();

	type SingleNoteData = {
		canonicalPitch: CanonicalPitch;
		pitch: Pitch;
		label: boolean;
		extraText?: string;
		highlighted: boolean;
	};

	type KeyData = {
		white: SingleNoteData;
		black?: SingleNoteData;
	};

	if (start.pitchClass.endsWith('b')) {
		throw new Error('Keyboards must start with a white note as of now');
	}

	const noteData: KeyData[] = $derived(
		new Array(noteNumber).fill(null).reduce<KeyData[]>((acc, _, idx) => {
			const canonicalPitch = CanonicalPitch.applyOffset(start, idx);
			const providedData = pitchData.find((p) => {
				return CanonicalPitch.equal(p.canonicalPitch, canonicalPitch);
			});

			if (canonicalPitch.pitchClass.endsWith('b')) {
				return [
					...acc.slice(0, acc.length - 1),
					{
						white: acc[acc.length - 1].white,
						black: {
							canonicalPitch,
							pitch: providedData?.pitch ?? Pitch.fromCanonical(canonicalPitch),
							label: !!providedData?.labeled,
							extraText: providedData?.extraText,
							highlighted: !!providedData?.highlighted
						}
					}
				];
			}

			return [
				...acc,
				{
					white: {
						canonicalPitch,
						pitch: providedData?.pitch ?? Pitch.fromCanonical(canonicalPitch),
						label: !!providedData?.labeled,
						extraText: providedData?.extraText,
						highlighted: !!providedData?.highlighted
					}
				}
			];
		}, [])
	);
</script>

{#snippet keyText(d: SingleNoteData)}
	<div class="flex flex-col">
		{#if d.extraText}
			<span>{d.extraText}</span>
		{/if}
		{#if d.label}
			<span>{Pitch.print(d.pitch)}</span>
		{/if}
	</div>
{/snippet}

<div class="overflow-auto rounded-md bg-gray-200 p-4 dark:bg-slate-600">
	<div class="flex w-min" style="--w: 20px; --h: 15px;">
		{#each noteData as { white, black } (Pitch.print(white.pitch))}
			<div class="relative h-[calc(15_*_var(--h))] w-[calc(2.4_*_var(--w))] shrink-0 grow-0">
				<!-- svelte-ignore a11y_mouse_events_have_key_events -->
				<button
					aria-label={`Toggle note ${Pitch.print(white.pitch)}`}
					class="flex h-full w-full items-end justify-center rounded-b-md border border-gray-600 pb-2 text-black"
					class:bg-blue-500={white.highlighted}
					class:bg-white={!white.highlighted}
					onclick={() => onClick?.(white.canonicalPitch)}
					onmousedown={() => onMouseDown?.(white.canonicalPitch)}
					onmouseup={() => onMouseUp?.(white.canonicalPitch)}
					onmouseout={() => onMouseOut?.(white.canonicalPitch)}
					onmouseenter={(e) => onMouseEnter?.(white.canonicalPitch, (e.buttons & 1) !== 0)}
				>
					{@render keyText(white)}
				</button>

				{#if black}
					<!-- svelte-ignore a11y_mouse_events_have_key_events -->
					<button
						aria-label={`Toggle note ${Pitch.print(black.pitch)}`}
						class="absolute top-0 right-0 z-20 flex h-[calc(9_*_var(--h))] w-[calc(1.4_*_var(--w))] translate-x-1/2 transform items-end justify-center rounded-b-md border-2 border-gray-600 pb-2 text-white"
						class:bg-blue-500={black.highlighted}
						class:bg-black={!black.highlighted}
						onclick={() => onClick?.(black.canonicalPitch)}
						onmousedown={() => onMouseDown?.(black.canonicalPitch)}
						onmouseup={() => onMouseUp?.(black.canonicalPitch)}
						onmouseout={() => onMouseOut?.(black.canonicalPitch)}
						onmouseenter={(e) => onMouseEnter?.(black.canonicalPitch, (e.buttons & 1) !== 0)}
					>
						{@render keyText(black)}
					</button>
				{/if}
			</div>
		{/each}
	</div>
</div>
