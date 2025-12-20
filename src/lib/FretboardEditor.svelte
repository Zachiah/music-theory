<script lang="ts">
	import Button from './Button.svelte';
	import { CanonicalPitch } from './CanonicalPitch';
	import { CanonicalPitchClass } from './CanonicalPitchClass';
	import FancyInput from './FancyInput.svelte';
	import FancySelect from './FancySelect.svelte';
	import type { Fretboard } from './Fretboard';
	import ModalDialogBase from './ModalDialogBase.svelte';
	import ModalDialogCard from './ModalDialogCard.svelte';

	const {
		onSave,
		open,
		onClose,
		baseFretboard,
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
			...currentFretboard.strings.slice(idx + 1),
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
				: '',
	);
	const stringsError = $derived(
		currentFretboard.strings.length === 0 ? 'Add at least 1 string' : '',
	);

	let triedSubmit = $state(false);

	const hasError = $derived(!!(nameError || fretsError || stringsError));
</script>

<ModalDialogBase {open} {onClose}>
	<ModalDialogCard>
		<h2 class="text-2xl">Fretboard</h2>

		<FancyInput
			placeholder="Preset Name"
			bind:value={currentFretboard.name}
			error={nameError}
			forceShowError={triedSubmit}
		/>

		<FancyInput
			placeholder="Frets"
			bind:value={
				() => '' + currentFretboard.frets,
				(v) => {
					const MAX_FRETS = 32;
					const f = Math.min(+v, MAX_FRETS);

					currentFretboard.frets = f;
					currentFretboard.dots = new Array(currentFretboard.frets).fill(0);
				}
			}
			error={fretsError}
		/>

		<div class="flex flex-col flex-wrap gap-4">
			<h3>Dots</h3>
			{#each currentFretboard.dots as dotData, idx (idx)}
				<div class="flex gap-2">
					<FancySelect
						placeholder="Fret Number"
						bind:value={() => '' + dotData.fretNumber, (v) => (dotData.fretNumber = +v)}
						options={Array.from({ length: currentFretboard.frets }).map((_, f) => ({
							value: '' + f,
							label: '' + f,
						}))}
					/>

					<FancySelect
						placeholder="Dots"
						bind:value={() => '' + dotData.dots, (v) => (dotData.dots = +v)}
						options={Array.from({ length: 2 }).map((_, f) => ({
							value: '' + (f + 1),
							label: '' + (f + 1),
						}))}
					/>

					<Button
						style="warning"
						onClick={() => {
							currentFretboard.dots = [
								...currentFretboard.dots.slice(0, idx),
								...currentFretboard.dots.slice(idx + 1),
							];
						}}
					>
						<span class="icon-[heroicons--x-mark]"></span>
					</Button>
				</div>
			{/each}
			<div>
				<Button
					onClick={() =>
						(currentFretboard.dots = [...currentFretboard.dots, { fretNumber: 1, dots: 1 }])}
					>Add dot(s) on fret</Button
				>
			</div>
		</div>

		<div class="flex flex-col flex-wrap gap-2">
			<h3>Strings</h3>
			{#if stringsError && triedSubmit}
				<p class="text-warning">{stringsError}</p>
			{/if}

			{#each currentFretboard.strings as string, idx (idx)}
				<div class="flex gap-2">
					<FancySelect
						placeholder="Pitch Class"
						bind:value={
							() => string.pitchClass,
							(v) => {
								if (!CanonicalPitchClass.pitches.includes(v)) {
									throw new Error('Invalid pitch');
								}
								onStringChange(idx, { ...string, pitchClass: v });
							}
						}
						options={CanonicalPitchClass.pitches.map((p) => ({ label: p, value: p }))}
					/>

					<FancySelect
						placeholder="Octave"
						bind:value={
							() => '' + string.octave, (v) => onStringChange(idx, { ...string, octave: +v })
						}
						options={Array.from({ length: 8 }).map((_, o) => ({
							value: '' + (o + 1),
							label: '' + (o + 1),
						}))}
					/>

					<Button
						style="warning"
						onClick={() => {
							currentFretboard.strings = [
								...currentFretboard.strings.slice(0, idx),
								...currentFretboard.strings.slice(idx + 1),
							];
						}}
					>
						<span class="icon-[heroicons--x-mark]"></span>
					</Button>
				</div>
			{/each}
			<div>
				<Button
					onClick={() =>
						(currentFretboard.strings = [
							...currentFretboard.strings,
							{ octave: 4, pitchClass: 'C' },
						])}>Add string</Button
				>
			</div>
		</div>

		<div class="flex gap-4">
			<div class="grow"></div>
			<Button
				disabled={triedSubmit && hasError}
				onClick={() => {
					if (hasError) {
						triedSubmit = true;
						return;
					}
					onSave(currentFretboard);
					onClose();
					resetData();
				}}>Save</Button
			>
			<Button
				style="warning"
				onClick={() => {
					onClose();
					resetData();
				}}>Cancel</Button
			>
		</div>
	</ModalDialogCard>
</ModalDialogBase>
