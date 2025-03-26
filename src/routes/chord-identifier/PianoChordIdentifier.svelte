<script lang="ts">
	import Piano from '$lib/Piano.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
	import { guessChord, GuessedChord } from '$lib/guessChord';
	import ChordPrintingOptionsEditor from './ChordPrintingOptionsEditor.svelte';

	let notes = $state(Array(CanonicalPitchClass.pitches.length * 3 + 1).fill(false));

	const intervalsWithExtra = $derived(
		notes.reduce<number[]>((acc, curr) => {
			if (acc.length === 0 && !curr) {
				return [];
			}

			if (!curr) {
				return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1];
			}

			return [...acc, 1];
		}, [])
	);

	const intervals = $derived(intervalsWithExtra.slice(0, intervalsWithExtra.length - 1));
	const intervalsFromStart = $derived(
		intervals.map((_, idx) => intervals.slice(0, idx + 1).reduce((a, b) => a + b))
	);

	const firstSelected = $derived(
		CanonicalPitchClass.applyOffset(
			'C',
			notes.findIndex((n) => n)
		)
	);

	const canonicalPitchClasses = $derived([
		firstSelected,
		...intervalsFromStart.map((i) => CanonicalPitchClass.applyOffset(firstSelected, i))
	]);

	let options = $state<GuessedChord.PrintingOptions>({
		six: true,
		sixNine: true,
		properFlats: true,
		properSharps: true,
		properDiminished: true,
		properAugmented: true
	});

	const chord = $derived(guessChord(canonicalPitchClasses));
	const chordString = $derived(GuessedChord.print(chord, options));
</script>

<ChordPrintingOptionsEditor
	{options}
	onChange={(o) => {
		options = o;
	}}
/>

<Piano {notes} start="C" toggle={(idx) => (notes[idx] = !notes[idx])} />

{#if notes.some((n) => n)}
	<p class="text-3xl">{chordString}</p>
{/if}
