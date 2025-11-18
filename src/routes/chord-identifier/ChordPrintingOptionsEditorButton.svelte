<script lang="ts">
	import Button from '$lib/Button.svelte';
	import type { GuessedChord } from '$lib/guessChord';
	import ModalDialogBase from '$lib/ModalDialogBase.svelte';
	import ModalDialogCard from '$lib/ModalDialogCard.svelte';
	import Toggle from '$lib/Toggle.svelte';

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
		<div class="flex flex-wrap gap-2">
			<Toggle
				active={options.six}
				onToggle={() => {
					onChange({ ...options, six: !options.six });
				}}
			>
				6 Chords
			</Toggle>

			<Toggle
				active={options.sixNine}
				onToggle={() => {
					onChange({ ...options, sixNine: !options.sixNine });
				}}
			>
				6/9 Chords
			</Toggle>

			<Toggle
				active={options.properFlats}
				onToggle={() => {
					onChange({ ...options, properFlats: !options.properFlats });
				}}
			>
				Proper flats
			</Toggle>

			<Toggle
				active={options.properSharps}
				onToggle={() => {
					onChange({ ...options, properSharps: !options.properSharps });
				}}
			>
				Proper sharps
			</Toggle>

			<Toggle
				active={options.properDiminished}
				onToggle={() => {
					onChange({ ...options, properDiminished: !options.properDiminished });
				}}
			>
				Proper diminished
			</Toggle>

			<Toggle
				active={options.properAugmented}
				onToggle={() => {
					onChange({ ...options, properAugmented: !options.properAugmented });
				}}
			>
				Proper augmented
			</Toggle>
		</div>

		<div class="mt-auto flex justify-end">
			<Button onClick={() => (open = false)}>Close</Button>
		</div>
	</ModalDialogCard>
</ModalDialogBase>
