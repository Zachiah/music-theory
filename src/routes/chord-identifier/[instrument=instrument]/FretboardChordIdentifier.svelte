<script lang="ts">
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import FretboardDisplay from '$lib/FretboardDisplay.svelte';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import FretboardCreator from '$lib/FretboardCreator.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import FretboardPresets from '$lib/FretboardPresets.svelte';
	import type { Fretboard } from '$lib/Fretboard';
	import { createLocalStorageState } from '$lib/localStorageState.svelte';

	const {
		options,
		onOptionsChange
	}: {
		options: GuessedChord.PrintingOptions;
		onOptionsChange(o: GuessedChord.PrintingOptions): void;
	} = $props();

	const guitarDots = [
		null,
		null,
		1,
		null,
		1,
		null,
		1,
		null,
		1,
		null,
		null,
		2,
		null,
		null,
		1,
		null,
		1,
		null,
		1,
		null,
		1
	];

	const ukeleleDots = [null, null, 1, null, 1, null, 1, null, null, 1, null, 1];

	const defaultPresets: Fretboard[] = [
		{
			name: 'Guitar',
			strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
			dots: guitarDots
		},
		{ name: 'Drop D Guitar', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E2'], dots: guitarDots },
		{ name: 'DADGAD', strings: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'], dots: guitarDots },
		{
			name: 'Ukelele (reentrant)',
			strings: ['G4', 'C4', 'E4', 'A4'],
			frets: 18,
			dots: ukeleleDots
		},
		{ name: 'Ukelele (low G)', strings: ['G3', 'C4', 'E4', 'A4'], frets: 18, dots: ukeleleDots }
	].map((row) => ({
		frets: 24,
		...row,
		strings: row.strings.map((s) => {
			const parsed = CanonicalPitch.parse(s);
			if (!parsed) {
				throw new Error('Failed to parse');
			}

			return parsed;
		})
	}));

	let fretboardPresets = createLocalStorageState<Fretboard[]>(
		'fretboardPresets',
		1,
		defaultPresets
	);

	let fretboard = $state(defaultPresets[0]);

	let pluggedAt: (number | null)[] = $state([null, null, null, null, null, null]);

	const stringDecorations = $derived(
		fretboard.strings.map((openPitch, stringIndex) =>
			new Array(fretboard.frets + 1).fill(null).map((_, idx) => {
				if (pluggedAt[stringIndex] === idx) {
					return 'active';
				}

				if (idx === 0) {
					return 'disabled';
				}

				return 'none';
			})
		)
	);

	const pitches = $derived.by(() => {
		const canonicalPitches = pluggedAt.flatMap((pa, idx) => {
			const string = fretboard.strings[idx];

			if (pa === null) {
				return [];
			}

			return CanonicalPitch.applyOffset(string, pa);
		});

		return CanonicalPitch.sort(canonicalPitches).map((p) => p.pitchClass);
	});

	let allowInversions = $state(true);
	let variableFretSize = $state(true);

	const chordString = $derived.by(() => {
		if (pitches.length === 0) {
			return '';
		}
		const guessedChord = allowInversions ? guessChord(pitches) : guessChordNoInversions(pitches);
		return GuessedChord.print(guessedChord, options);
	});

	let vertical = $state(false);
</script>

<div class="flex gap-4">
	<Toggle
		active={vertical}
		onToggle={() => {
			vertical = !vertical;
		}}
	>
		Vertical fretboard
	</Toggle>

	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />

	<FretboardCreator
		onCreate={(f) => {
			fretboardPresets.data = [...fretboardPresets.data, f];
			fretboard = f;
			pluggedAt = new Array(fretboard.strings.length).fill(null);
		}}
	/>

	<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
		>Allow Inversions</Toggle
	>

	<Toggle active={variableFretSize} onToggle={() => (variableFretSize = !variableFretSize)}>
		Variable Fret Size
	</Toggle>
</div>

<FretboardPresets
	presets={fretboardPresets.data}
	activeFretboard={fretboard}
	onSelect={(f) => {
		fretboard = f;
		pluggedAt = new Array(f.strings.length).fill(null);
	}}
/>

<div class="mt-8 flex gap-8" class:flex-col={!vertical}>
	<FretboardDisplay
		{fretboard}
		{stringDecorations}
		{vertical}
		{variableFretSize}
		onClick={(stringIndex, fretIndex) => {
			if (pluggedAt[stringIndex] === fretIndex) {
				pluggedAt[stringIndex] = null;
			} else {
				pluggedAt[stringIndex] = fretIndex;
			}
		}}
	/>

	<div class="flex flex-col gap-8">
		{#if pluggedAt.some((p) => p !== null)}
			<p class="text-3xl">{chordString}</p>
		{/if}
	</div>
</div>
