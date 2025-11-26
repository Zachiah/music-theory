<script lang="ts">
	import Button from './Button.svelte';
	import { CanonicalPitchArray } from './CanonicalPitch';
	import { guessChord, GuessedChord } from './guessChord';
	import { Intervals } from './Intervals';
	import { PitchClass } from './PitchClass';
	import { printingOptions } from './printingOptionsState.svelte';
	import { playback } from './Playback';

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
			{GuessedChord.print(guessChord(canonicalPitchClasses), printingOptions.data, triad)}
		</Button>
	{/each}
</div>
