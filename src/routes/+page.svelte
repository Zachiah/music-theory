<script lang="ts">
	import { PitchClass } from '$lib/PitchClass';
	import { ScaleDescription, ScaleName } from '$lib/scale';
	import { Chord } from '$lib/Chord';
	import { Intervals } from '$lib/Intervals';

	import ChordIdentifier from './ChordIdentifier.svelte';

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

<div class="mx-auto flex max-w-2xl flex-col gap-4 py-4">
	{#if !typedPitch && typedPitchString}
		<div class="rounded-lg bg-red-300 p-4">
			Unparsable note: {typedPitchString}
		</div>
	{:else}
		<div class="p-4">&nbsp;</div>
	{/if}

	<div>
		<form class="flex">
			<input
				class="flex-1 rounded-l-full"
				placeholder="Type a note. (Ex. C)"
				bind:value={typedPitchString}
			/>

			<div class="flex items-stretch bg-gray-200 p-2">
				<label class="group relative flex w-24 shrink-0 rounded-full bg-white">
					<div
						class="absolute top-0 right-full h-full w-1/2 translate-x-full transform rounded-full bg-blue-500 duration-200 group-has-checked:right-0 group-has-checked:translate-x-0"
					></div>

					<span
						class="absolute flex h-full w-1/2 items-center justify-center rounded-l-full text-center text-xs"
					>
						<span>Scale</span>
					</span>

					<input
						type="checkbox"
						class="opacity-0"
						checked={noteCollection.tag === 'chord'}
						onchange={(e) => {
							if (e.currentTarget.checked) {
								noteCollection = chords[0];
							} else {
								noteCollection = scales[0];
							}
						}}
					/>

					<span
						class="absolute left-1/2 flex h-full w-1/2 items-center justify-center rounded-r-full text-center text-xs"
					>
						<span>Chord</span>
					</span>
				</label>
			</div>

			<select class="flex-1 rounded-r-full" bind:value={noteCollection}>
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
		<article class="rounded-md bg-gray-200 px-4 py-2">
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
				<span class="ml-auto rounded-full bg-white px-4 py-2">Scale</span>
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

		<article class="rounded-md bg-gray-200 px-4 py-2">
			<div class="flex items-center gap-2">
				<h2 class="mb-2 text-2xl">
					{PitchClass.print(pitch)}
					{chord.names[0]}
				</h2>
				{#if chord.names.length > 1}
					({chord.names.slice(1).join(', ')})
				{/if}

				<span class="ml-auto rounded-full bg-white px-4 py-2">Chord</span>
			</div>

			<p class="mb-2">
				{Intervals.getPitches(chord.intervals, pitch)
					.map((n) => PitchClass.print(n))
					.join(', ')}
			</p>
			<p>{chord.description}</p>
		</article>
	{/if}

	<ChordIdentifier />
</div>
