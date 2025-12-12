<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import { Pitch } from './Pitch';
	import SubContainer from './SubContainer.svelte';

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

<SubContainer>
	<div class="flex w-min" style="--w: 20px; --h: 15px;">
		{#each noteData as { white, black } (Pitch.print(white.pitch))}
			<div class="relative h-[calc(15*var(--h))] w-[calc(2.4*var(--w))] shrink-0 grow-0">
				<!-- svelte-ignore a11y_mouse_events_have_key_events -->
				<button
					aria-label={`Toggle note ${Pitch.print(white.pitch)}`}
					class="text-always-black border-always-gray-medium flex h-full w-full items-end justify-center rounded-b-md border pb-2"
					class:bg-primary={white.highlighted}
					class:bg-always-white={!white.highlighted}
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
						class="text-always-white border-always-gray-medium absolute top-0 right-0 z-20 flex h-[calc(9*var(--h))] w-[calc(1.4*var(--w))] translate-x-1/2 transform items-end justify-center rounded-b-md border-2 pb-2"
						class:bg-primary={black.highlighted}
						class:bg-always-black={!black.highlighted}
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
</SubContainer>
