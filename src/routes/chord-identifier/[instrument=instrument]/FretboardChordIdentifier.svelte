<script lang="ts">
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import FretboardDisplay from '$lib/FretboardDisplay.svelte';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import Toggle from '$lib/Toggle.svelte';
	import type { Fretboard } from '$lib/Fretboard';
	import { createLocalStorageState } from '$lib/localStorageState.svelte';
	import FretboardSelector from '$lib/FretboardSelector.svelte';
	import { defaultPresets } from '$lib/fretboardPresets';

	const {
		options,
		onOptionsChange
	}: {
		options: GuessedChord.PrintingOptions;
		onOptionsChange(o: GuessedChord.PrintingOptions): void;
	} = $props();

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
	<h2 class="mr-auto text-2xl">{fretboardData.fretboard.name}</h2>

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

	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />

	<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
		>Allow Inversions</Toggle
	>
</div>

<div class="flex gap-8" class:flex-col={!vertical}>
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
		<p class="text-3xl">&nbsp;{chordString}</p>
	</div>
</div>
