<script lang="ts">
	import Container from '$lib/Container.svelte';
	import ChordIdentifierHeader from '../ChordIdentifierHeader.svelte';
	import { guessChord, guessChordNoInversions } from '$lib/chord/guessChord';
	import FretboardDisplay from '$lib/FretboardDisplay.svelte';
	import { CanonicalPitch, CanonicalPitchArray } from '$lib/CanonicalPitch';
	import Toggle from '$lib/Toggle.svelte';
	import type { Fretboard } from '$lib/Fretboard';
	import { createLocalStorageState } from '$lib/localStorageState.svelte';
	import FretboardSelector from '$lib/FretboardSelector.svelte';
	import { defaultPresets } from '$lib/fretboardPresets';
	import Button from '$lib/Button.svelte';
	import { playback } from '$lib/Playback';
	import GrandStaff from '$lib/staff/GrandStaff.svelte';
	import { normalizeChordPitchesWithOctaves } from '$lib/chord/categorizeChordNotes';
	import SubContainer from '$lib/SubContainer.svelte';
	import { Chord } from '$lib/chord/chord';
	import { musicDisplayOptions } from '$lib/musicDisplayOptionsState.svelte';
	import MusicDisplayOptionsEditorButton from '../MusicDisplayOptionsEditorButton.svelte';

	let fretboardPresets = createLocalStorageState<Fretboard[]>(
		'fretboardPresets',
		3,
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

		return CanonicalPitchArray.sort(canonicalPitches);
	});

	let allowInversions = $state(true);
	let variableFretSize = $state(true);

	const guessedChord = $derived.by(() => {
		if (pitches.length === 0) {
			return null;
		}

		const pitchClasses = pitches.map((pitch) => pitch.pitchClass);

		return allowInversions
			? guessChord(pitchClasses)
			: guessChordNoInversions(pitchClasses, pitchClasses[0]);
	});

	const chordString = $derived(
		guessedChord ? Chord.print(guessedChord, musicDisplayOptions.data) : ''
	);

	let vertical = $state(false);
</script>

<Container>
	<ChordIdentifierHeader showFretboard={true} />

	<div class="flex flex-wrap gap-4">
		<h2 class="text-2xl">{fretboardData.fretboard.name}</h2>

		<Button
			disabled={pitches.length === 0}
			onClick={() => {
				playback.demoChord(pitches, playback.now());
			}}
		>
			<span class="icon-[heroicons--speaker-wave]"></span>
		</Button>

		<span class="grow"></span>

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

		<MusicDisplayOptionsEditorButton
			options={musicDisplayOptions.data}
			onChange={(v) => {
				musicDisplayOptions.data = v;
			}}
		/>

		<Toggle active={allowInversions} onToggle={() => (allowInversions = !allowInversions)}
			>Allow Inversions</Toggle
		>
	</div>

	<div class="flex gap-4" class:flex-col={!vertical} class:flex-col-reverse={vertical}>
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

		<div class="flex gap-4">
			<SubContainer>
				<GrandStaff
					notes={guessedChord
						? normalizeChordPitchesWithOctaves(pitches, guessedChord).map((p) => p.pitch)
						: []}
				/>
			</SubContainer>

			<SubContainer el="p" class="grow text-3xl">
				&nbsp;{chordString}
			</SubContainer>
		</div>
	</div>
</Container>
