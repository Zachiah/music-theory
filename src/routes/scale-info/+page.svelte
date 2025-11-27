<script lang="ts">
	import Container from '$lib/Container.svelte';
	import { PitchClass } from '$lib/PitchClass';
	import { ScaleDescription, ScaleName } from '$lib/scale';
	import { Intervals } from '$lib/Intervals';
	import Button from '$lib/Button.svelte';
	import { CanonicalPitchArray } from '$lib/CanonicalPitch';
	import ScaleChordsOfPattern from '$lib/ScaleChordsOfPattern.svelte';
	import FancySelect from '$lib/FancySelect.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import { playback } from '$lib/Playback';

	let typedPitchString = $state('C');
	const typedPitch = $derived(PitchClass.create(typedPitchString));
	const pitch = $derived(typedPitch || PitchClass.create('c')!);

	const scales = ScaleDescription.scales;

	let selectedScaleSlug = $state(scales[0].slug);

	const scale = $derived(scales.find((scale) => scale.slug === selectedScaleSlug)!);

	const chordPatterns = {
		Triads: [0, 2, 4],
		'7ths': [0, 2, 4, 6],
		'9ths': [0, 2, 4, 6, 8],
		'11ths': [0, 2, 4, 6, 8, 10],
		'13ths': [0, 2, 4, 6, 8, 10, 12]
	};
</script>

<Container maxW>
	<h1 class="pb-4 text-4xl">Scale Info</h1>

	<div>
		<form class="flex flex-col gap-2 md:flex-row">
			<FancyInput placeholder="Tonic" bind:value={typedPitchString} />

			<FancySelect
				placeholder="Scale Type"
				bind:value={selectedScaleSlug}
				options={scales.map((scale) => ({
					label: ScaleName.print(scale.names[0]),
					value: scale.slug
				}))}
			/>
		</form>
	</div>

	<article class="flex flex-col gap-2 rounded-md bg-gray-200 px-4 py-2 dark:bg-slate-600">
		<div class="flex items-center gap-2">
			<h2 class="text-2xl">
				{PitchClass.print(pitch)}
				{ScaleName.print(scale.names[0])}
			</h2>
			{#if scale.names.length > 1}
				({scale.names
					.slice(1)
					.map((n) => ScaleName.print(n))
					.join(', ')})
			{/if}
		</div>

		<p>{scale.description}</p>

		<h3 class="text-xl">Notes</h3>
		<div>
			<Button
				onClick={() => {
					playback.demoScale(
						[
							...CanonicalPitchArray.fromCanonicalPitchClasses(
								Intervals.getPitches(scale.intervals, pitch).map((p) =>
									PitchClass.toCanonicalPitchClass(p)
								),
								4
							),
							{
								pitchClass: PitchClass.toCanonicalPitchClass(pitch),
								octave: 5
							}
						],
						playback.now()
					);
				}}
			>
				<span class="icon-[heroicons--speaker-wave]"></span>
			</Button>

			<span
				>{Intervals.getPitches(scale.intervals, pitch)
					.map((n) => PitchClass.print(n))
					.join(', ')}</span
			>
		</div>

		{#if scale.intervals.length === 6}
			{#each Object.entries(chordPatterns) as [name, pattern] (name)}
				<h3 class="text-xl">Diatonic {name}</h3>
				<ScaleChordsOfPattern {pattern} pitchClass={pitch} intervals={scale.intervals} />
			{/each}
		{/if}
	</article>

	{#if !typedPitch && typedPitchString}
		<div class="rounded-lg bg-red-300 p-4">
			Unparsable note: {typedPitchString}
		</div>
	{:else}
		<div class="p-4">&nbsp;</div>
	{/if}
</Container>
