<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { printingOptions } from '$lib/printingOptionsState.svelte';
	import ChordIdentifierHeader from '../ChordIdentifierHeader.svelte';
	import { demoChord } from '$lib/toneState.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditorButton from '../ChordPrintingOptionsEditorButton.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import Button from '$lib/Button.svelte';
	import { CanonicalPitchArray } from '$lib/CanonicalPitch';
	import * as Tone from 'tone';

	let selectedPitches: CanonicalPitchArray = $state([]);

	let allowInversions = $state(true);

	const chordString = $derived.by(() => {
		if (selectedPitches.length === 0) {
			return '';
		}

		const pitchClasses = selectedPitches.map((p) => p.pitchClass);
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
			disabled={selectedPitches.length === 0}
			onClick={() => {
				demoChord(selectedPitches, Tone.now());
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
		start={{ pitchClass: 'C', octave: 3 }}
		noteNumber={37}
		activePitches={selectedPitches}
		toggle={(pitch) => {
			const foundIndex = selectedPitches.findIndex(
				(p) => p.pitchClass === pitch.pitchClass && p.octave === pitch.octave
			);
			if (foundIndex !== -1) {
				selectedPitches.splice(foundIndex, 1);
			} else {
				selectedPitches.push(pitch);
			}

			CanonicalPitchArray.sort(selectedPitches);
		}}
		labels="selected"
	/>

	<p class="text-3xl">&nbsp;{chordString}</p>
</Container>
