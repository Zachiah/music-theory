<script lang="ts">
	import Button from '$lib/Button.svelte';
	import type { GuessedChord } from '$lib/guessChord';
	import ModalDialogBase from '$lib/ModalDialogBase.svelte';
	import ModalDialogCard from '$lib/ModalDialogCard.svelte';
	import FancySelect from '$lib/FancySelect.svelte';

	const {
		options,
		onChange
	}: {
		options: GuessedChord.PrintingOptions;
		onChange(o: GuessedChord.PrintingOptions): void;
	} = $props();

	let open = $state(false);
</script>

<Button onClick={() => (open = true)}>Edit Chord Display</Button>

<ModalDialogBase {open} onClose={() => (open = false)}>
	<ModalDialogCard>
		<h2 class="text-2xl">Chord Display Options</h2>

		<div class="flex flex-wrap gap-2">
			<FancySelect
				placeholder="6 Chords"
				bind:value={
					() => (options.six ? 'true' : 'false'), (v) => onChange({ ...options, six: v === 'true' })
				}
				options={[
					{ value: 'true', label: 'Yes' },
					{ value: 'false', label: 'No (add13)' }
				]}
			/>

			<FancySelect
				placeholder="6/9 Chords"
				bind:value={
					() => (options.sixNine ? 'true' : 'false'),
					(v) => onChange({ ...options, sixNine: v === 'true' })
				}
				options={[
					{ value: 'true', label: 'Yes' },
					{ value: 'false', label: 'No (add9add13)' }
				]}
			/>

			<FancySelect
				placeholder="Flats"
				bind:value={
					() => options.flats,
					(v) => onChange({ ...options, flats: v as GuessedChord.PrintingOptions['flats'] })
				}
				options={[
					{ value: 'b', label: 'b' },
					{ value: '♭', label: '♭' }
				]}
			/>

			<FancySelect
				placeholder="Sharps"
				bind:value={
					() => options.sharps,
					(v) => onChange({ ...options, sharps: v as GuessedChord.PrintingOptions['sharps'] })
				}
				options={[
					{ value: '#', label: '#' },
					{ value: '♯', label: '♯' }
				]}
			/>

			<FancySelect
				placeholder="Major"
				bind:value={
					() => options.major,
					(v) => onChange({ ...options, major: v as GuessedChord.PrintingOptions['major'] })
				}
				options={[
					{ value: 'maj', label: 'maj' },
					{ value: 'Δ', label: 'Δ' }
				]}
			/>

			<FancySelect
				placeholder="Minor"
				bind:value={
					() => options.minor,
					(v) => onChange({ ...options, minor: v as GuessedChord.PrintingOptions['minor'] })
				}
				options={[
					{ value: 'm', label: 'm' },
					{ value: '-', label: '-' }
				]}
			/>

			<FancySelect
				placeholder="Diminished"
				bind:value={
					() => options.diminished,
					(v) =>
						onChange({ ...options, diminished: v as GuessedChord.PrintingOptions['diminished'] })
				}
				options={[
					{ value: 'dim', label: 'dim' },
					{ value: '°', label: '°' }
				]}
			/>

			<FancySelect
				placeholder="Augmented"
				bind:value={
					() => options.augmented,
					(v) => onChange({ ...options, augmented: v as GuessedChord.PrintingOptions['augmented'] })
				}
				options={[
					{ value: 'aug', label: 'aug' },
					{ value: '+', label: '+' },
					{ value: '#5', label: '#5' }
				]}
			/>

			<FancySelect
				placeholder="Half Diminished"
				bind:value={
					() => options.halfDiminished,
					(v) =>
						onChange({
							...options,
							halfDiminished: v as GuessedChord.PrintingOptions['halfDiminished']
						})
				}
				options={[
					{ value: 'ø', label: 'ø' },
					{ value: 'm7b5', label: 'm7b5' }
				]}
			/>

			<FancySelect
				placeholder="Slash Notation"
				bind:value={
					() => (options.slashNotation ? 'true' : 'false'),
					(v) => onChange({ ...options, slashNotation: v === 'true' })
				}
				options={[
					{ value: 'true', label: 'Yes' },
					{ value: 'false', label: 'No' }
				]}
			/>
		</div>

		<div class="mt-auto flex justify-end">
			<Button onClick={() => (open = false)}>Close</Button>
		</div>
	</ModalDialogCard>
</ModalDialogBase>
