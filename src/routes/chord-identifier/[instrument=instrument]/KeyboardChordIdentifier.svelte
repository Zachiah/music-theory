<script lang="ts">
	import Keyboard from '$lib/Keyboard.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
	import { guessChord, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditorButton from './ChordPrintingOptionsEditorButton.svelte';

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

	const chordString = $derived.by(() => {
		if (pitches.length === 0) {
			return '';
		}
		const guessedChord = guessChord(pitches);
		return GuessedChord.print(guessedChord, options);
	});
</script>

<div>
	<ChordPrintingOptionsEditorButton {options} onChange={onOptionsChange} />
</div>

<Keyboard
	notes={noteSelections}
	start="C"
	toggle={(idx) => (noteSelections[idx] = !noteSelections[idx])}
/>

<p class="text-3xl">{chordString}</p>
