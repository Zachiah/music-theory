<script lang="ts">
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import FretboardDisplay from '$lib/FretboardDisplay.svelte';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import Toggle from '$lib/Toggle.svelte';
	import type { Fretboard } from '$lib/Fretboard';
	import { createLocalStorageState } from '$lib/localStorageState.svelte';
	import FretboardSelector from '$lib/FretboardSelector.svelte';
	import { generateId } from '$lib/generateId';

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
		id: generateId(),
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
		2,
		defaultPresets
	);

	let fretboardId = createLocalStorageState<string>('fretboardId', 1, fretboardPresets.data[0].id);

	const fretboardData = $derived.by(() => {
		const f = fretboardPresets.data.find((f) => fretboardId.data === f.id);
		if (!f) {
			throw new Error(`Unable to find fretboard with id: ${fretboardId.data}`);
		}

		let pluggedAt: (number | null)[] = $state([null, null, null, null, null, null]);

		return {
			fretboard: f,
			get pluggedAt() {
				return pluggedAt;
			},
			set pluggedAt(n: (number | null)[]) {
				pluggedAt = n;
			}
		};
	});

	const stringDecorations = $derived(
		fretboardData.fretboard.strings.map((openPitch, stringIndex) =>
			new Array(fretboardData.fretboard.frets + 1).fill(null).map((_, idx) => {
				if (fretboardData.pluggedAt[stringIndex] === idx) {
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
		const canonicalPitches = fretboardData.pluggedAt.flatMap((pa, idx) => {
			const string = fretboardData.fretboard.strings[idx];

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
	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />

	<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
		>Allow Inversions</Toggle
	>

	<FretboardSelector
		verticalFretboard={vertical}
		onToggleVerticalFretboard={() => (vertical = !vertical)}
		{variableFretSize}
		onToggleVariableFretSize={() => (variableFretSize = !variableFretSize)}
		activeFretboard={fretboardData.fretboard}
		onSelect={(id) => {
			fretboardId.data = id;
		}}
		presets={fretboardPresets.data}
		onCreate={(f) => {
			fretboardPresets.data = [...fretboardPresets.data, f];
			fretboardId.data = f.id;
		}}
		onDelete={(id) => {
			fretboardPresets.data = fretboardPresets.data.filter((f) => f.id !== id);
			if (fretboardId.data === id) {
				fretboardId.data = fretboardPresets.data[0].id;
			}
		}}
		onUpdate={(id, n) => {
			fretboardPresets.data = fretboardPresets.data.map((fb) => (fb.id === id ? n : fb));
		}}
	/>
</div>

<div class="mt-8 flex gap-8" class:flex-col={!vertical}>
	<FretboardDisplay
		fretboard={fretboardData.fretboard}
		{stringDecorations}
		{vertical}
		{variableFretSize}
		onClick={(stringIndex, fretIndex) => {
			if (fretboardData.pluggedAt[stringIndex] === fretIndex) {
				fretboardData.pluggedAt[stringIndex] = null;
			} else {
				fretboardData.pluggedAt[stringIndex] = fretIndex;
			}
		}}
	/>

	<div class="flex flex-col gap-8">
		{#if fretboardData.pluggedAt.some((p) => p !== null)}
			<p class="text-3xl">{chordString}</p>
		{/if}
	</div>
</div>
