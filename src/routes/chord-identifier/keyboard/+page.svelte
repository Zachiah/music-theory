<script lang="ts">
	import Container from '$lib/Container.svelte';
	import ChordIdentifierHeader from '../ChordIdentifierHeader.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import Button from '$lib/Button.svelte';
	import { onMount } from 'svelte';
	import { decodeMIDIMessage } from '$lib/midi';
	import GrandStaff from '$lib/staff/GrandStaff.svelte';
	import { playback } from '$lib/Playback';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import { Pitch } from '$lib/Pitch';
	import SubContainer from '$lib/SubContainer.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import CircleOfFifths from '$lib/CircleOfFifths.svelte';
	import { Chord } from '$lib/chord/chord';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import { PitchClass } from '$lib/PitchClass';
	import MusicDisplayOptionsEditorButton from '../MusicDisplayOptionsEditorButton.svelte';
	import { ScaleDegree } from '$lib/chord/scaleDegree';
	import { printChord } from '$lib/chord/printChord';

	const cpaState = createCpaState();

	const guessedChord = $derived.by(() => {
		if (cpaState.selected.length === 0) {
			return null;
		}

		const pitchClasses = cpaState.selected.map((p) => p.pitchClass);
		const guessedChord = Chord.guessFromPitches(pitchClasses);

		return guessedChord;
	});

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

	const normalized = $derived(
		!guessedChord ? [] : guessedChord.getNormalizedPitchesWithOctaves(cpaState.selected)
	);
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

		<MusicDisplayOptionsEditorButton
			options={musicDisplayOptions.data}
			onChange={(v) => {
				musicDisplayOptions.data = v;
			}}
		/>
	</div>

	<SubContainer>
		<Keyboard
			start={{ pitchClass: 'C', octave: 3 }}
			noteNumber={37}
			onClick={cpaState.toggle}
			highlighted={cpaState.selected}
		>
			{#snippet renderKeyText(cp)}
				{@const foundNormalized = normalized.find((n) =>
					CanonicalPitch.equal(Pitch.toCanonical(n.pitch), cp)
				)}
				{#if foundNormalized}
					<div class="flex flex-col">
						<span>{ScaleDegree.print(foundNormalized.scaleDegree)}</span>
						<span>{Pitch.print(foundNormalized.pitch, musicDisplayOptions.data)}</span>
					</div>
				{/if}
			{/snippet}
		</Keyboard>
	</SubContainer>

	<div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
		<SubContainer class="flex items-center justify-center">
			<GrandStaff notes={normalized.map((p) => p.pitch)} />
		</SubContainer>

		<SubContainer class="flex items-center justify-center">
			<CircleOfFifths
				highlighted={guessedChord ? PitchClass.toCanonicalPitchClass(guessedChord.root) : undefined}
				selected={normalized.map((n) => n.pitch.pitchClass)}
			/>
		</SubContainer>

		<SubContainer el="p" class="flex items-center justify-center text-3xl">
			&nbsp;{guessedChord ? printChord(guessedChord, musicDisplayOptions.data) : ''}
		</SubContainer>
	</div>
</Container>
