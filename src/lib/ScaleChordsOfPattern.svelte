<script lang="ts">
	import Button from './Button.svelte';
	import { CanonicalPitchArray } from './CanonicalPitch';
	import { Intervals } from './Intervals';
	import { PitchClass } from './PitchClass';
	import { playback } from './Playback';
	import { Chord } from './chord/chord';
	import { printChord } from './chord/printChord';
	import { musicDisplayOptions } from './musicDisplayOptionsState.svelte';

	const {
		pattern,
		intervals,
		pitchClass
	}: { pattern: number[]; intervals: Intervals; pitchClass: PitchClass } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each Intervals.getAllOfChordPattern(intervals, pitchClass, pattern) as triad, idx (idx)}
		{@const canonicalPitchClasses = triad.map((p) => PitchClass.toCanonicalPitchClass(p))}

		<Button
			onClick={() => {
				playback.demoChord(
					CanonicalPitchArray.fromCanonicalPitchClasses(canonicalPitchClasses, 4),
					playback.now()
				);
			}}
		>
			<span class="icon-[heroicons--speaker-wave]"></span>
			{printChord(
				Chord.guessFromPitchesWithRoot(triad[0], canonicalPitchClasses),
				musicDisplayOptions.data
			)}
		</Button>
	{/each}
</div>
