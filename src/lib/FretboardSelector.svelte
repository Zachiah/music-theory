<script lang="ts">
	import Button from './Button.svelte';
	import type { Fretboard } from './Fretboard';
	import FretboardCreatorButton from './FretboardCreatorButton.svelte';
	import FretboardPresets from './FretboardPresets.svelte';
	import ModalDialogBase from './ModalDialogBase.svelte';
	import ModalDialogCard from './ModalDialogCard.svelte';
	import Toggle from './Toggle.svelte';

	const {
		verticalFretboard,
		onToggleVerticalFretboard,
		variableFretSize,
		onToggleVariableFretSize,
		activeFretboard,
		onSelect,
		presets,
		onCreate,
		onDelete,
		onUpdate
	}: {
		verticalFretboard: boolean;
		onToggleVerticalFretboard(): void;
		variableFretSize: boolean;
		onToggleVariableFretSize(): void;
		activeFretboard: Fretboard;
		onSelect(id: string): void;
		presets: Fretboard[];
		onCreate(f: Fretboard): void;
		onDelete(id: string): void;
		onUpdate(id: string, n: Fretboard): void;
	} = $props();

	let open = $state(false);
	const openIt = () => (open = true);
	const closeIt = () => (open = false);

	let editing = $state(false);
	const toggleEditing = () => (editing = !editing);
</script>

<Button onClick={openIt}>Change Fretboard</Button>

<ModalDialogBase {open} onClose={closeIt}>
	<ModalDialogCard>
		<div class="flex gap-4">
			<h2 class="mr-auto text-2xl">Choose fretboard</h2>
			<Toggle
				title="Toggle vertical fretboard"
				active={verticalFretboard}
				onToggle={onToggleVerticalFretboard}
			>
				<span class="icon-[heroicons--arrow-path]"></span>
			</Toggle>
			<Toggle
				title="Toggle variable fret size"
				active={variableFretSize}
				onToggle={onToggleVariableFretSize}
			>
				<div class="flex h-full">
					<div class="mr-2 w-[2px] bg-current"></div>
					<div class="mr-1.5 w-[2px] bg-current"></div>
					<div class="mr-1 w-[2px] bg-current"></div>
					<div class="w-[2px] bg-current"></div>
				</div>
			</Toggle>

			<Toggle active={editing} onToggle={toggleEditing}>
				<span class="icon-[heroicons--pencil]"></span>
			</Toggle>
		</div>

		<FretboardPresets {activeFretboard} {onSelect} {presets} {editing} {onDelete} {onUpdate} />

		<div class="flex">
			<FretboardCreatorButton {onCreate} />
		</div>
	</ModalDialogCard>
</ModalDialogBase>
