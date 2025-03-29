<script lang="ts">
	import Keyboard from '$lib/Keyboard.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import TwoSidedToggle from '$lib/TwoSidedToggle.svelte';

	const {
		options,
		onOptionsChange
	}: {
		options: GuessedChord.PrintingOptions;
		onOptionsChange(o: GuessedChord.PrintingOptions): void;
	} = $props();

	let noteSelections = $state(Array(CanonicalPitchClass.pitches.length * 3 + 1).fill(false));

	const pitches = $derived(
		noteSelections.flatMap((noteSelection, idx) => {
			if (!noteSelection) {
				return [];
			}

			return CanonicalPitchClass.applyOffset('C', idx);
		})
	);

	let allowInversions = $state(true);

	const chordString = $derived.by(() => {
		if (pitches.length === 0) {
			return '';
		}
		const guessedChord = allowInversions ? guessChord(pitches) : guessChordNoInversions(pitches);
		return GuessedChord.print(guessedChord, options);
	});
</script>

<div class="flex gap-4">
	<h2 class="mr-auto text-2xl">Keyboard</h2>
	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />
	<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
		>Allow Inversions</Toggle
	>
</div>

<Keyboard
	notes={noteSelections}
	start="C"
	toggle={(idx) => (noteSelections[idx] = !noteSelections[idx])}
/>

<p class="text-3xl">{chordString}</p>
