<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import { CanonicalPitchClass } from './CanonicalPitchClass';

	const {
		strings,
		onChange
	}: { strings: CanonicalPitch[]; onChange(n: CanonicalPitch[]): void; flip: boolean } = $props();

	const onStringChange = (idx: number, newString: CanonicalPitch) => {
		onChange([...strings.slice(0, idx), newString, ...strings.slice(idx + 1)]);
	};

	const presets: { name: string; strings: CanonicalPitch[] }[] = [
		{ name: 'Guitar', strings: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] },
		{ name: 'Drop D Guitar', strings: ['D2', 'A2', 'D3', 'G3', 'B3', 'E2'] },
		{ name: 'Ukelele (reentrant)', strings: ['G4', 'C4', 'E4', 'A4'] },
		{ name: 'Ukelele (low G)', strings: ['G3', 'C4', 'E4', 'A4'] }
	].map((row) => ({
		...row,
		strings: row.strings.map((s) => {
			const parsed = CanonicalPitch.parse(s);
			if (!parsed) {
				throw new Error('Failed to parse');
			}

			return parsed;
		})
	}));
</script>

<div class="flex flex-wrap gap-4">
	{#each presets as { name, strings: presetStrings }}
		{@const current =
			presetStrings.length === strings.length &&
			presetStrings.every(
				(s, i) => s.pitchClass === strings[i].pitchClass && s.octave === strings[i].octave
			)}
		<button
			class="rounded-md px-4 py-2 duration-100 hover:bg-blue-500"
			class:bg-blue-500={current}
			class:bg-gray-200={!current}
			onclick={() => {
				onChange(presetStrings);
			}}>{name}</button
		>
	{/each}
</div>

<!--
<div class="flex flex-wrap gap-2">
	{#each strings as string, idx}
		<div class="flex rounded-full">
			<select
				class="w-16 rounded-l-full px-4 py-2 text-xs"
				value={string.pitchClass}
				oninput={(e) => {
					const p = e.currentTarget.value as CanonicalPitchClass;
					if (!CanonicalPitchClass.pitches.includes(p)) {
						throw new Error('Invalid pitch');
					}
					onStringChange(idx, { ...string, pitchClass: p });
				}}
			>
				{#each CanonicalPitchClass.pitches as pitch}
					<option>{pitch}</option>
				{/each}
			</select>

			<select
				class="w-10 bg-[right_.5rem] px-2 py-2 text-xs"
				value={string.octave}
				oninput={(e) => {
					onStringChange(idx, { ...string, octave: +e.currentTarget.value });
				}}
			>
				{#each new Array(8).fill(null).map((_, i) => i + 1) as octave}
					<option>{octave}</option>
				{/each}
			</select>

			<button
				class="rounded-r-full border px-4"
				onclick={() => {
					onChange([...strings.slice(0, idx), ...strings.slice(idx + 1)]);
				}}>X</button
			>
		</div>
	{/each}
	<div>
		<button onclick={() => onChange([...strings, { octave: 4, pitchClass: 'C' }])}>+</button>
	</div>
</div>
-->
