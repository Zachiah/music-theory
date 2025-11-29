<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { printingOptions } from '$lib/printingOptionsState.svelte';
	import ChordIdentifierHeader from '../ChordIdentifierHeader.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { guessChord, guessChordNoInversions, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditorButton from '../ChordPrintingOptionsEditorButton.svelte';
	import Toggle from '$lib/Toggle.svelte';
	import Button from '$lib/Button.svelte';
	import { onMount } from 'svelte';
	import { decodeMIDIMessage } from '$lib/midi';
	import GrandStaff from '$lib/staff/GrandStaff.svelte';
	import { normalizeChordPitchesWithOctaves, ScaleDegree } from '$lib/categorizeChordNotes';
	import { playback } from '$lib/Playback';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';

	let allowInversions = $state(true);

	const cpaState = createCpaState();

	const guessedChord = $derived.by(() => {
		if (cpaState.selected.length === 0) {
			return null;
		}

		const pitchClasses = cpaState.selected.map((p) => p.pitchClass);
		const guessedChord = allowInversions
			? guessChord(pitchClasses)
			: guessChordNoInversions(pitchClasses);

		return guessedChord;
	});

	const chordString = $derived(
		guessedChord === null ? '' : GuessedChord.print(guessedChord, printingOptions.data)
	);

	const onMIDIMessage = (event: MIDIMessageEvent) => {
		const message = decodeMIDIMessage(event);

		if (message.tag === 'note-down') {
			cpaState.enable(message.pitch);
			return;
		}

		if (message.tag === 'note-up') {
			cpaState.disable(message.pitch);
			return;
		}
	};

	onMount(() => {
		midiAccess.requestAccess();
		return midiAccess.listen(onMIDIMessage);
	});
</script>

<Container>
	<ChordIdentifierHeader showFretboard={false} />

	<div class="flex flex-wrap gap-4">
		<h2 class="mr-auto text-2xl">Keyboard</h2>
		<Button
			disabled={cpaState.selected.length === 0}
			onClick={() => {
				playback.demoChord(cpaState.selected, playback.now());
			}}
		>
			<span class="icon-[heroicons--speaker-wave]"></span>
		</Button>

		<span class="grow"></span>

		<ChordPrintingOptionsEditorButton
			options={printingOptions.data}
			onChange={(v) => {
				printingOptions.data = v;
			}}
		/>
		<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
			>Allow Inversions</Toggle
		>
	</div>

	<Keyboard
		start={{ pitchClass: 'C', octave: 3 }}
		noteNumber={37}
		activePitches={guessedChord
			? normalizeChordPitchesWithOctaves(cpaState.selected, guessedChord).map((p) => ({
					pitch: p.pitch,
					extraText: ScaleDegree.print(p.scaleDegree)
				}))
			: []}
		toggle={cpaState.toggle}
		labels="selected"
	/>

	<div class="flex gap-4">
		<GrandStaff
			notes={guessedChord
				? normalizeChordPitchesWithOctaves(cpaState.selected, guessedChord).map((p) => p.pitch)
				: []}
		/>

		<p class="flex-grow rounded-md bg-gray-200 p-4 text-3xl dark:bg-slate-600">
			&nbsp;{chordString}
		</p>
	</div>
</Container>
