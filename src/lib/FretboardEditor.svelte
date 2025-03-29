<script lang="ts">
	import Button from './Button.svelte';
	import { CanonicalPitch } from './CanonicalPitch';
	import { CanonicalPitchClass } from './CanonicalPitchClass';
	import FormField from './FormField.svelte';
	import type { Fretboard } from './Fretboard';
	import ModalDialogBase from './ModalDialogBase.svelte';
	import ModalDialogCard from './ModalDialogCard.svelte';

	const {
		onSave,
		open,
		onClose,
		baseFretboard
	}: {
		onSave(f: Fretboard): void;
		open: boolean;
		onClose(): void;
		baseFretboard: Fretboard;
	} = $props();

	let currentFretboard = $state({ ...baseFretboard });

	const onStringChange = (idx: number, newString: CanonicalPitch) => {
		currentFretboard.strings = [
			...currentFretboard.strings.slice(0, idx),
			newString,
			...currentFretboard.strings.slice(idx + 1)
		];
	};

	const resetData = () => {
		currentFretboard = baseFretboard;
	};

	const nameError = $derived(!currentFretboard.name.trim() ? 'Please enter a name' : '');
	const fretsError = $derived(
		currentFretboard.frets === 0
			? 'Frets cannot be 0'
			: isNaN(currentFretboard.frets)
				? 'Please enter a valid fret number'
				: ''
	);
	const stringsError = $derived(
		currentFretboard.strings.length === 0 ? 'Add at least 1 string' : ''
	);

	const hasError = $derived(!!(nameError || fretsError || stringsError));
</script>

<ModalDialogBase {open} {onClose}>
	<ModalDialogCard>
		<h2 class="text-2xl">Fretboard</h2>

		<FormField label="Preset Name" error={nameError}>
			<input class="dark:bg-slate-600" bind:value={currentFretboard.name} />
		</FormField>

		<FormField label="Frets" error={fretsError}>
			<input
				class="dark:bg-slate-600"
				type="number"
				value={currentFretboard.frets}
				oninput={(e) => {
					currentFretboard.frets = +e.currentTarget.value;
					currentFretboard.dots = new Array(currentFretboard.frets).fill(0);
				}}
			/>
		</FormField>

		<h3 class="text-2xl">Dots</h3>
		<div class="flex flex-wrap gap-4">
			{#each currentFretboard.dots as dot, dotIdx}
				<label class="flex gap-4 rounded-md p-4 shadow-md">
					<div>Fret {dotIdx + 1}</div>
					<input
						class="w-12 border-0 border-b p-0 text-right dark:bg-slate-600"
						type="number"
						value={dot}
						oninput={(e) => {
							currentFretboard.dots[dotIdx] = +e.currentTarget.value;
						}}
					/>
				</label>
			{/each}
		</div>

		<FormField el="div" label="Strings" error={stringsError}>
			<div class="flex flex-col flex-wrap gap-2">
				{#each currentFretboard.strings as string, idx}
					<div class="flex rounded-full">
						<select
							class="w-16 rounded-l-full px-4 py-2 text-xs dark:bg-slate-600"
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
							class="w-10 bg-[right_.5rem] px-2 py-2 text-xs dark:bg-slate-600"
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
								currentFretboard.strings = [
									...currentFretboard.strings.slice(0, idx),
									...currentFretboard.strings.slice(idx + 1)
								];
							}}>X</button
						>
					</div>
				{/each}
				<div>
					<Button
						onClick={() =>
							(currentFretboard.strings = [
								...currentFretboard.strings,
								{ octave: 4, pitchClass: 'C' }
							])}>Add string</Button
					>
				</div>
			</div>
		</FormField>

		<div class="flex gap-4">
			<div class="grow"></div>
			<Button
				disabled={hasError}
				onClick={() => {
					onSave(currentFretboard);
					onClose();
					resetData();
				}}>Save</Button
			>
			<Button
				style="danger"
				onClick={() => {
					onClose();
					resetData();
				}}>Cancel</Button
			>
		</div>
	</ModalDialogCard>
</ModalDialogBase>
