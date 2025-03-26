<script lang="ts">
	import Piano from './Piano.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
	import { guessChord, GuessedChord } from '$lib/guessChord';
	import Toggle from './Toggle.svelte';

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

	const options = $state<GuessedChord.PrintingOptions>({
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

<div class="flex flex-wrap gap-2">
	<Toggle
		active={options.six}
		onToggle={() => {
			options.six = !options.six;
		}}
	>
		6 Chords
	</Toggle>

	<Toggle
		active={options.sixNine}
		onToggle={() => {
			options.sixNine = !options.sixNine;
		}}
	>
		6/9 Chords
	</Toggle>

	<Toggle
		active={options.properFlats}
		onToggle={() => {
			options.properFlats = !options.properFlats;
		}}
	>
		Proper flats
	</Toggle>

	<Toggle
		active={options.properSharps}
		onToggle={() => {
			options.properSharps = !options.properSharps;
		}}
	>
		Proper sharps
	</Toggle>

	<Toggle
		active={options.properDiminished}
		onToggle={() => {
			options.properDiminished = !options.properDiminished;
		}}
	>
		Proper diminished
	</Toggle>

	<Toggle
		active={options.properAugmented}
		onToggle={() => {
			options.properAugmented = !options.properAugmented;
		}}
	>
		Proper augmented
	</Toggle>
</div>

<Piano {notes} start="C" toggle={(idx) => (notes[idx] = !notes[idx])} />

{#if notes.some((n) => n)}
	<p class="text-3xl">{chordString}</p>
{/if}
