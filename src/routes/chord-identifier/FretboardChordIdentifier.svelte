<script lang="ts">
	import { guessChord, GuessedChord } from '$lib/guessChord';
	import Fretboard from '$lib/Fretboard.svelte';
	import ChordPrintingOptionsEditor from './ChordPrintingOptionsEditor.svelte';
	import { CanonicalPitch } from '$lib/CanonicalPitch';
	import FretboardCreator from '$lib/FretboardCreator.svelte';
	import Toggle from '$lib/Toggle.svelte';

	let stringPitches: CanonicalPitch[] = $state([
		{ pitchClass: 'E', octave: 4 },
		{ pitchClass: 'B', octave: 3 },
		{ pitchClass: 'G', octave: 3 },
		{ pitchClass: 'D', octave: 3 },
		{ pitchClass: 'A', octave: 2 },
		{ pitchClass: 'E', octave: 2 }
	]);

	let pluggedAt: (number | null)[] = $state([null, null, null, null, null, null]);

	const strings = $derived(
		stringPitches.map((sp, stringIndex) => ({
			open: sp,
			frets: new Array(24).fill(null).map((_, idx) => {
				if (pluggedAt[stringIndex] === idx) {
					return 'active';
				}

				if (idx === 0) {
					return 'disabled';
				}

				return 'none';
			})
		}))
	);

	const pitches = $derived.by(() => {
		const canonicalPitches = pluggedAt.flatMap((pa, idx) => {
			const string = stringPitches[idx];

			if (pa === null) {
				return [];
			}

			return CanonicalPitch.applyOffset(string, pa);
		});

		return CanonicalPitch.sort(canonicalPitches).map((p) => p.pitchClass);
	});

	const guessedChord = $derived(guessChord(pitches));

	let options = $state<GuessedChord.PrintingOptions>({
		six: true,
		sixNine: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	});

	const chordString = $derived(GuessedChord.print(guessedChord, options));

	let flip = $state(true);
</script>

<div>
	<Toggle
		active={flip}
		onToggle={() => {
			flip = !flip;
		}}>Flip fretboard</Toggle
	>
</div>

<FretboardCreator
	{flip}
	strings={stringPitches}
	onChange={(s) => {
		stringPitches = s;
		pluggedAt = new Array(s.length).fill(null);
	}}
/>

<Fretboard
	{flip}
	onClick={(stringIndex, fretIndex) => {
		if (pluggedAt[stringIndex] === fretIndex) {
			pluggedAt[stringIndex] = null;
		} else {
			pluggedAt[stringIndex] = fretIndex;
		}
	}}
	{strings}
/>

<ChordPrintingOptionsEditor {options} onChange={(o) => (options = o)} />

{#if pluggedAt.some((p) => p !== null)}
	<p class="text-3xl">{chordString}</p>
{/if}
