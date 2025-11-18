<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { printingOptions } from '$lib/printingOptionsState.svelte';
	import ChordIdentifierHeader from '../ChordIdentifierHeader.svelte';
	import { demoChord } from '$lib/toneState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditorButton from '../ChordPrintingOptionsEditorButton.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import Button from '$lib/Button.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';

	let noteSelections = $state(Array(CanonicalPitchClass.pitches.length * 3 + 1).fill(false));

	const pitches = $derived(
		noteSelections.flatMap((noteSelection, idx) => {
			if (!noteSelection) {
				return [];
			}

			return CanonicalPitch.applyOffset({ octave: 3, pitchClass: 'C' }, idx);
		})
	);

	let allowInversions = $state(true);

	const chordString = $derived.by(() => {
		if (pitches.length === 0) {
			return '';
		}

		const pitchClasses = pitches.map((p) => p.pitchClass);
		const guessedChord = allowInversions
			? guessChord(pitchClasses)
			: guessChordNoInversions(pitchClasses);

		return GuessedChord.print(guessedChord, printingOptions.data);
	});
</script>

<Container>
	<ChordIdentifierHeader showFretboard={false} />

	<div class="flex flex-wrap gap-4">
		<h2 class="mr-auto text-2xl">Keyboard</h2>
		<Button
			disabled={pitches.length === 0}
			onClick={() => {
				demoChord(pitches);
			}}
		>
			<span class="icon-[heroicons--speaker-wave]"></span>
		</Button>

		<span class="grow"></span>
		<ChordPrintingOptionsEditorButton
			options={printingOptions.data}
			onChange={(v) => (printingOptions.data = v)}
		/>
		<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
			>Allow Inversions</Toggle
		>
	</div>

	<Keyboard
		notes={noteSelections}
		start="C"
		toggle={(idx) => (noteSelections[idx] = !noteSelections[idx])}
	/>

	<p class="text-3xl">&nbsp;{chordString}</p>
</Container>
