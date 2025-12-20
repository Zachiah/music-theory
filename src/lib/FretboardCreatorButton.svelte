<script lang="ts">
	import Button from './Button.svelte';
	import type { Fretboard } from './Fretboard';
	import FretboardEditor from './FretboardEditor.svelte';
	import { generateId } from './generateId';

	let open = $state(false);

	const { onCreate }: { onCreate(f: Fretboard): void } = $props();

	let base: Fretboard = $state({
		id: generateId(),
		name: '',
		strings: [],
		dots: [],
		frets: 24,
	});
</script>

<Button onClick={() => (open = true)}>Create Preset</Button>

<FretboardEditor
	baseFretboard={base}
	{open}
	onClose={() => (open = false)}
	onSave={(f) => {
		onCreate(f);
		base.id = generateId();
	}}
/>
