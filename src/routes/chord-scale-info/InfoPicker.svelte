<script lang="ts">
	import { PitchClass } from '$lib/PitchClass';
	import { ScaleDescription, ScaleName } from '$lib/scale';
	import { Chord } from '$lib/Chord';
	import { Intervals } from '$lib/Intervals';
	import TwoSidedToggle from '$lib/TwoSidedToggle.svelte';

	let typedPitchString = $state('');
	const typedPitch = $derived(PitchClass.create(typedPitchString));
	const pitch = $derived(typedPitch || PitchClass.create('c')!);

	const scales = ScaleDescription.scales.map((s) => ({ tag: 'scale' as const, scale: s }));
	const chords = Chord.chords.map((s) => ({ tag: 'chord' as const, chord: s }));

	let noteCollection:
		| {
				tag: 'scale';
				scale: ScaleDescription;
		  }
		| {
				tag: 'chord';
				chord: Chord.ChordDescription;
		  } = $state(scales[0]);
</script>

<div>
	<form class="flex flex-col gap-2 md:flex-row md:gap-0">
		<input
			class="flex-1 rounded-l-full dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-300"
			placeholder="Type a note. (Ex. C)"
			bind:value={typedPitchString}
		/>

		<div class="flex w-28 shrink-0 items-stretch bg-gray-200 p-2 dark:bg-slate-600">
			<TwoSidedToggle
				onChange={(checked) => {
					if (checked) {
						noteCollection = chords[0];
					} else {
						noteCollection = scales[0];
					}
				}}
				checked={noteCollection.tag === 'chord'}
				first="Scale"
				second="Chord"
			/>
		</div>

		<select
			class="flex-1 rounded-r-full dark:bg-slate-600 dark:text-white dark:placeholder:text-slate-300"
			bind:value={noteCollection}
		>
			{#if noteCollection.tag === 'scale'}
				{#each scales as aScale}
					<option value={aScale}>{ScaleName.print(aScale.scale.names[0])}</option>
				{/each}
			{:else}
				{#each chords as chord}
					<option value={chord}>{chord.chord.names[0]}</option>
				{/each}
			{/if}
		</select>
	</form>
</div>

{#if noteCollection.tag === 'scale'}
	{@const scale = noteCollection.scale}
	<article class="rounded-md bg-gray-200 px-4 py-2 dark:bg-slate-600">
		<div class="flex items-center gap-2">
			<h2 class="mb-2 text-2xl">
				{PitchClass.print(pitch)}
				{ScaleName.print(scale.names[0])}
			</h2>
			{#if scale.names.length > 1}
				({scale.names
					.slice(1)
					.map((n) => ScaleName.print(n))
					.join(', ')})
			{/if}
			<span class="ml-auto rounded-full bg-white px-4 py-2 dark:bg-slate-800">Scale</span>
		</div>

		<p class="mb-2">
			{Intervals.getPitches(scale.intervals, pitch)
				.map((n) => PitchClass.print(n))
				.join(', ')}
		</p>
		<p>{scale.description}</p>
	</article>
{:else}
	{@const chord = noteCollection.chord}

	<article class="rounded-md bg-gray-200 px-4 py-2 dark:bg-slate-600">
		<div class="flex items-center gap-2">
			<h2 class="mb-2 text-2xl">
				{PitchClass.print(pitch)}
				{chord.names[0]}
			</h2>
			{#if chord.names.length > 1}
				({chord.names.slice(1).join(', ')})
			{/if}

			<span class="ml-auto rounded-full bg-white px-4 py-2 dark:bg-slate-800">Chord</span>
		</div>

		<p class="mb-2">
			{Intervals.getPitches(chord.intervals, pitch)
				.map((n) => PitchClass.print(n))
				.join(', ')}
		</p>
		<p>{chord.description}</p>
	</article>
{/if}

{#if !typedPitch && typedPitchString}
	<div class="rounded-lg bg-red-300 p-4">
		Unparsable note: {typedPitchString}
	</div>
{:else}
	<div class="p-4">&nbsp;</div>
{/if}
