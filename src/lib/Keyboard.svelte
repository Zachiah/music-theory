<script lang="ts">
	import type { Snippet } from 'svelte';
	import { CanonicalPitch } from './CanonicalPitch';
	import { Pitch } from './Pitch';
	import { musicDisplayOptions } from './musicDisplayOptionsState.svelte';

	const {
		start,
		noteNumber,
		onMouseDown,
		onMouseUp,
		onClick,
		onMouseOut,
		onMouseEnter,
		renderKeyText,
		highlighted,
		whiteKeyWidth = 48,
	}: {
		start: CanonicalPitch;
		noteNumber: number;
		onMouseDown?: (pitch: CanonicalPitch) => void;
		onMouseUp?: (pitch: CanonicalPitch) => void;
		onClick?: (pitch: CanonicalPitch) => void;
		onMouseOut?: (pitch: CanonicalPitch) => void;
		onMouseEnter?: (pitch: CanonicalPitch, mousePressed: boolean) => void;
		renderKeyText: Snippet<[pitch: CanonicalPitch]>;
		highlighted: CanonicalPitch[];
		whiteKeyWidth?: number;
	} = $props();

	type KeyPair = {
		white: CanonicalPitch;
		black?: CanonicalPitch;
	};

	if (start.pitchClass.endsWith('b')) {
		throw new Error('Keyboards must start with a white note as of now');
	}

	const noteData: KeyPair[] = $derived(
		new Array(noteNumber).fill(null).reduce<KeyPair[]>((acc, _, idx) => {
			const canonicalPitch = CanonicalPitch.applyOffset(start, idx);

			if (canonicalPitch.pitchClass.endsWith('b')) {
				return [
					...acc.slice(0, acc.length - 1),
					{
						white: acc[acc.length - 1].white,
						black: canonicalPitch,
					},
				];
			}

			return [
				...acc,
				{
					white: canonicalPitch,
				},
			];
		}, []),
	);

	type KeySnippetProps = {
		pitch: CanonicalPitch;
		highlighted: boolean;
	};

	const highlightedStr = $derived(
		highlighted
			.map((hp) => Pitch.id(Pitch.fromCanonical(hp)))
			.sort()
			.join(','),
	);
</script>

{#snippet whiteKey(props: KeySnippetProps)}
	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<button
		aria-label={`Toggle note ${Pitch.print(Pitch.fromCanonical(props.pitch), musicDisplayOptions.data)}`}
		class="text-always-black border-always-gray-medium flex h-full w-full items-end justify-center rounded-b-md border pb-2"
		class:bg-primary={props.highlighted}
		class:bg-always-white={!props.highlighted}
		onclick={() => onClick?.(props.pitch)}
		onmousedown={() => onMouseDown?.(props.pitch)}
		onmouseup={() => onMouseUp?.(props.pitch)}
		onmouseout={() => onMouseOut?.(props.pitch)}
		onmouseenter={(e) => onMouseEnter?.(props.pitch, (e.buttons & 1) !== 0)}
	>
		<div class="pointer-events-none">
			{@render renderKeyText(props.pitch)}
		</div>
	</button>
{/snippet}

{#snippet blackKey(props: KeySnippetProps)}
	<!-- svelte-ignore a11y_mouse_events_have_key_events -->
	<button
		aria-label={`Toggle note ${Pitch.print(Pitch.fromCanonical(props.pitch), musicDisplayOptions.data)}`}
		class="text-always-white border-always-gray-medium absolute top-0 right-0 z-20 flex h-[calc(9*var(--h))] w-[calc(7/12*var(--w))] translate-x-1/2 transform items-end justify-center rounded-b-md border-2 pb-2"
		class:bg-primary={props.highlighted}
		class:bg-always-black={!props.highlighted}
		onclick={() => onClick?.(props.pitch)}
		onmousedown={() => onMouseDown?.(props.pitch)}
		onmouseup={() => onMouseUp?.(props.pitch)}
		onmouseout={() => onMouseOut?.(props.pitch)}
		onmouseenter={(e) => onMouseEnter?.(props.pitch, (e.buttons & 1) !== 0)}
	>
		<div class="pointer-events-none">
			{@render renderKeyText(props.pitch)}
		</div>
	</button>
{/snippet}

<div class="flex w-min" style="--w: {whiteKeyWidth}px; --h: {(5 / 16) * whiteKeyWidth}px">
	{#each noteData as nd (Pitch.id(Pitch.fromCanonical(nd.white)))}
		<div class="relative h-[calc(15*var(--h))] w-(--w) shrink-0 grow-0">
			{@render whiteKey({
				pitch: nd.white,
				highlighted: highlightedStr.includes(Pitch.id(Pitch.fromCanonical(nd.white))),
			})}
			{#if nd.black}
				{@render blackKey({
					pitch: nd.black,
					highlighted: highlightedStr.includes(Pitch.id(Pitch.fromCanonical(nd.black))),
				})}
			{/if}
		</div>
	{/each}
</div>
