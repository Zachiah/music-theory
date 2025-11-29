<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { CanonicalPitch, CanonicalPitchArray } from '$lib/CanonicalPitch';
	import Container from '$lib/Container.svelte';
	import { createCpaState } from '$lib/cpaState.svelte';
	import FancyInput from '$lib/FancyInput.svelte';
	import Keyboard from '$lib/Keyboard.svelte';
	import { decodeMIDIMessage } from '$lib/midi';
	import { midiAccess } from '$lib/midiAccess.svelte';
	import { Pitch } from '$lib/Pitch';
	import GrandStaff from '$lib/staff/GrandStaff.svelte';
	import { chooseRandom } from '$lib/util';
	import { onMount } from 'svelte';

	const cpaState = createCpaState({
		onChange: () => checkValid()
	});

	onMount(() => {
		midiAccess.requestAccess();
		return midiAccess.listen((e) => {
			const m = decodeMIDIMessage(e);

			if (m.tag === 'note-down') {
				cpaState.enable(m.pitch);
			}

			if (m.tag === 'note-up') {
				cpaState.disable(m.pitch);
			}
		});
	});

	const getRandomPitches = (amount: number) => {
		const available = CanonicalPitch.getRangeInclusive(
			{ pitchClass: 'C', octave: 2 },
			{ pitchClass: 'C', octave: 6 }
		);

		const res: CanonicalPitchArray = [];

		while (res.length < amount) {
			const n = chooseRandom(available);
			if (!res.includes(n)) {
				res.push(n);
			}
		}

		return res;
	};

	const parseNotesAtATime = (s: string): null | number => {
		const n = +s;

		if (isNaN(n)) {
			return null;
		}

		if (n < 1) {
			return null;
		}

		if (n - (n % 1) !== n) {
			return null;
		}

		if (n > 15) {
			return null;
		}

		return n;
	};

	type GameState =
		| { tag: 'init'; notesAtATime: string; triedSubmit: boolean }
		| {
				tag: 'playing';
				notesAtATime: number;
				correctPitches: CanonicalPitchArray;
				completed: number;
		  };

	let gameState: GameState = $state({ tag: 'init', notesAtATime: '1', triedSubmit: false });

	const checkValid = () => {
		if (gameState.tag === 'init') {
			return;
		}

		if (cpaState.selected.length !== gameState.correctPitches.length) {
			return;
		}

		for (const p of gameState.correctPitches) {
			if (!CanonicalPitchArray.includes(cpaState.selected, p)) {
				return;
			}
		}

		gameState = {
			...gameState,
			correctPitches: getRandomPitches(gameState.notesAtATime),
			completed: gameState.completed + 1
		};
		cpaState.clear();
	};
</script>

<Container>
	<div class="flex">
		<h1 class="text-4xl">Sight Reading Game</h1>

		{#if gameState.tag === 'playing'}
			<p class="ml-auto">Completed: {gameState.completed}</p>
		{/if}
	</div>

	{#if gameState.tag === 'init'}
		{@const parsed = parseNotesAtATime(gameState.notesAtATime)}
		{@const error = parsed === null ? 'Enter an integer 1-15' : ''}
		<div class="flex gap-4">
			<FancyInput
				forceShowError={gameState.triedSubmit}
				{error}
				placeholder="Notes at a time"
				bind:value={gameState.notesAtATime}
			/>
			<Button
				disabled={gameState.triedSubmit && !!error}
				onClick={() => {
					if (error) {
						(gameState as GameState & { tag: 'init' }).triedSubmit = true;
					} else {
						gameState = {
							tag: 'playing',
							notesAtATime: parsed!,
							correctPitches: getRandomPitches(parsed!),
							completed: 0
						};
					}
				}}>Start</Button
			>
		</div>
	{:else if gameState.tag === 'playing'}
		<GrandStaff notes={gameState.correctPitches.map(Pitch.fromCanonical)} />
		<Keyboard
			noteNumber={49}
			start={{ pitchClass: 'C', octave: 2 }}
			activePitches={cpaState.selected.map((pitch) => ({ pitch: Pitch.fromCanonical(pitch) }))}
			labels="all"
			toggle={cpaState.toggle}
		/>
	{/if}
</Container>
