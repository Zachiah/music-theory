<script lang="ts">
	import { guessChord, GuessedChord } from '$lib/guessChord';
	import Fretboard from '$lib/Fretboard.svelte';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import FretboardCreator from '$lib/FretboardCreator.svelte';
	import Toggle from '$lib/Toggle.svelte';

	const {
		options,
		onOptionsChange
	}: {
		options: GuessedChord.PrintingOptions;
		onOptionsChange(o: GuessedChord.PrintingOptions): void;
	} = $props();

	let stringPitches: CanonicalPitch[] = $state([
		{ pitchClass: 'E', octave: 4 },
		{ pitchClass: 'B', octave: 3 },
		{ pitchClass: 'G', octave: 3 },
		{ pitchClass: 'D', octave: 3 },
		{ pitchClass: 'A', octave: 2 },
		{ pitchClass: 'E', octave: 2 }
	]);

	let pluggedAt: (number | null)[] = $state([null, null, null, null, null, null]);

	const strings = $derived(
		stringPitches.map((sp, stringIndex) => ({
			open: sp,
			frets: new Array(24).fill(null).map((_, idx) => {
				if (pluggedAt[stringIndex] === idx) {
					return 'active';
				}

				if (idx === 0) {
					return 'disabled';
				}

				return 'none';
			})
		}))
	);

	const pitches = $derived.by(() => {
		const canonicalPitches = pluggedAt.flatMap((pa, idx) => {
			const string = stringPitches[idx];

			if (pa === null) {
				return [];
			}

			return CanonicalPitch.applyOffset(string, pa);
		});

		return CanonicalPitch.sort(canonicalPitches).map((p) => p.pitchClass);
	});

	const guessedChord = $derived(guessChord(pitches));

	const chordString = $derived(GuessedChord.print(guessedChord, options));

	let vertical = $state(false);
</script>

<div>
	<Toggle
		active={vertical}
		onToggle={() => {
			vertical = !vertical;
		}}
	>
		Vertical fretboard
	</Toggle>
</div>

<FretboardCreator
	strings={stringPitches}
	onChange={(s) => {
		stringPitches = s;
		pluggedAt = new Array(s.length).fill(null);
	}}
/>

<div>
	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />
</div>

<div class="mt-8 flex gap-8" class:flex-col={!vertical}>
	<Fretboard
		{vertical}
		onClick={(stringIndex, fretIndex) => {
			if (pluggedAt[stringIndex] === fretIndex) {
				pluggedAt[stringIndex] = null;
			} else {
				pluggedAt[stringIndex] = fretIndex;
			}
		}}
		{strings}
	/>

	<div class="flex flex-col gap-8">
		{#if pluggedAt.some((p) => p !== null)}
			<p class="text-3xl">{chordString}</p>
		{/if}
	</div>
</div>
