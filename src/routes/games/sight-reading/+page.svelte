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
	import SubContainer from '$lib/SubContainer.svelte';
	import { createTickerState } from '$lib/tickerState.svelte';
	import { chooseRandom, formatTimeString } from '$lib/util';
	import { onMount } from 'svelte';

	const tickerState = createTickerState(100);

	const KEYBOARD_START: CanonicalPitch = { pitchClass: 'C', octave: 2 };
	const KEYBOARD_LENGTH = 49;
	const KEYBOARD_END = CanonicalPitch.applyOffset(KEYBOARD_START, KEYBOARD_LENGTH - 1);

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
		const available = CanonicalPitch.getRangeInclusive(KEYBOARD_START, KEYBOARD_END);

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
				startedAt: number;
				startedRoundAt: number;
		  }
		| { tag: 'paused'; pausedAt: number; prev: GameState & { tag: 'playing' } };

	let gameState: GameState = $state({ tag: 'init', notesAtATime: '1', triedSubmit: false });

	const checkValid = () => {
		if (gameState.tag !== 'playing') {
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
			completed: gameState.completed + 1,
			startedRoundAt: +new Date()
		};
		cpaState.clear();
	};
</script>

<Container>
	<div class="flex">
		<h1 class="text-4xl">Sight Reading Game</h1>
		<p>(Supports MIDI)</p>

		{#if gameState.tag === 'playing' || gameState.tag === 'paused'}
			{@const g = gameState.tag === 'playing' ? gameState : gameState.prev}
			{@const currTime = gameState.tag === 'playing' ? tickerState.tick : gameState.pausedAt}
			<p class="ml-auto flex flex-col">
				<span>Completed: {g.completed}</span>
				<span>Elapsed: {formatTimeString(Math.floor((currTime - g.startedAt) / 1000))}</span>
				<span>Current: {formatTimeString(Math.floor((currTime - g.startedRoundAt) / 1000))}</span>
				<Button
					onClick={() => {
						gameState = {
							tag: 'paused',
							pausedAt: +new Date(),
							prev: gameState as typeof gameState & { tag: 'playing' }
						};
					}}><span class="icon-[heroicons--pause]"></span></Button
				>
			</p>
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
							completed: 0,
							startedAt: +new Date(),
							startedRoundAt: +new Date()
						};
					}
				}}>Start</Button
			>
		</div>
	{:else if gameState.tag === 'playing' || gameState.tag === 'paused'}
		{@const g = gameState.tag === 'playing' ? gameState : gameState.prev}
		<div class="flex gap-4">
			<SubContainer>
				<GrandStaff notes={g.correctPitches.map(Pitch.fromCanonical)} />
			</SubContainer>

			{#if cpaState.selected.length > 0}
				<SubContainer>
					<GrandStaff notes={cpaState.selected.map(Pitch.fromCanonical)} />
				</SubContainer>
			{/if}
		</div>
		<SubContainer>
			<Keyboard
				noteNumber={49}
				start={KEYBOARD_START}
				highlighted={cpaState.selected}
				onClick={cpaState.toggle}
			>
				{#snippet renderKeyText(cp)}
					<div class="text-sm">{Pitch.print(Pitch.fromCanonical(cp))}</div>
				{/snippet}
			</Keyboard>
		</SubContainer>
	{/if}

	{#if gameState.tag === 'paused'}
		<button
			class="bg-surface-1/70 absolute top-0 left-0 z-20 flex h-full w-full cursor-pointer items-center justify-center gap-4 rounded-md backdrop-blur-md"
			onclick={() => {
				const g = gameState as typeof gameState & { tag: 'paused' };
				const pausedFor = +new Date() - g.pausedAt;
				gameState = {
					...g.prev,
					startedAt: g.prev.startedAt + pausedFor,
					startedRoundAt: g.prev.startedRoundAt + pausedFor
				};
			}}
		>
			<span class="text-2xl">Paused</span>
			<span class="icon-[heroicons--play] size-10"></span>
		</button>
	{/if}
</Container>
