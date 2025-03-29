<script lang="ts">
	import Button from './Button.svelte';
	import { CanonicalPitch } from './CanonicalPitch';
	import { CanonicalPitchClass } from './CanonicalPitchClass';
	import FormField from './FormField.svelte';
	import type { Fretboard } from './Fretboard';
	import ModalDialogBase from './ModalDialogBase.svelte';

	let open = $state(false);

	let name = $state('');
	let frets = $state(24);
	let dots: (number | null)[] = $state(new Array(24).fill(0));

	const {
		onCreate
	}: {
		onCreate(f: Fretboard): void;
	} = $props();

	let strings = $state<CanonicalPitch[]>([]);
	const onStringChange = (idx: number, newString: CanonicalPitch) => {
		strings = [...strings.slice(0, idx), newString, ...strings.slice(idx + 1)];
	};

	const resetData = () => {
		strings = [];
		name = '';
		frets = 24;
		dots = new Array(24).fill(0);
	};

	const nameError = $derived(!name.trim() ? 'Please enter a name' : '');
	const fretsError = $derived(
		frets === 0 ? 'Frets cannot be 0' : isNaN(frets) ? 'Please enter a valid fret number' : ''
	);
	const stringsError = $derived(strings.length === 0 ? 'Add at least 1 string' : '');

	const hasError = $derived(!!(nameError || fretsError || stringsError));
</script>

<Button onClick={() => (open = true)}>Create Preset</Button>

<ModalDialogBase {open} onClose={() => (open = false)}>
	<div
		class="mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col gap-8 overflow-y-auto rounded-md bg-white p-8 shadow-lg"
	>
		<h2 class="text-2xl">Fretboard</h2>

		<FormField label="Preset Name" error={nameError}>
			<input bind:value={name} />
		</FormField>

		<FormField label="Frets" error={fretsError}>
			<input
				type="number"
				value={frets}
				oninput={(e) => {
					frets = +e.currentTarget.value;
					dots = new Array(frets).fill(0);
				}}
			/>
		</FormField>

		<h3 class="text-2xl">Dots</h3>
		<div class="flex flex-wrap gap-4">
			{#each dots as dot, dotIdx}
				<label class="flex gap-4 rounded-md p-4 shadow-md">
					<div>Fret {dotIdx + 1}</div>
					<input
						class="w-12 border-0 border-b p-0 text-right"
						type="number"
						value={dot}
						oninput={(e) => {
							dots[dotIdx] = +e.currentTarget.value;
						}}
					/>
				</label>
			{/each}
		</div>

		<FormField el="div" label="Strings" error={stringsError}>
			<div class="flex flex-col flex-wrap gap-2">
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
								strings = [...strings.slice(0, idx), ...strings.slice(idx + 1)];
							}}>X</button
						>
					</div>
				{/each}
				<div>
					<Button onClick={() => (strings = [...strings, { octave: 4, pitchClass: 'C' }])}
						>Add string</Button
					>
				</div>
			</div>
		</FormField>

		<div class="flex gap-4">
			<div class="grow"></div>
			<Button
				disabled={hasError}
				onClick={() => {
					open = false;
					onCreate({
						name,
						strings,
						frets,
						dots
					});
					resetData();
				}}>Save</Button
			>
			<Button
				style="danger"
				onClick={() => {
					open = false;
					resetData();
				}}>Cancel</Button
			>
		</div>
	</div>
</ModalDialogBase>
