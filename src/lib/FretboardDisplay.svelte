<script lang="ts">
	import { CanonicalPitch } from './CanonicalPitch';
	import type { Fretboard } from './Fretboard';
	import { Pitch } from './Pitch';

	type FretActivation = 'neutral' | 'disabled' | 'active' | 'none';

	const {
		onClick,
		vertical,
		fretboard,
		stringDecorations,
		variableFretSize
	}: {
		onClick: (string: number, fret: number) => void;
		vertical: boolean;
		fretboard: Fretboard;
		stringDecorations: FretActivation[][];
		variableFretSize: boolean;
	} = $props();

	const usableStrings = $derived.by(() => {
		const indexed = fretboard.strings.map((s, idx) => ({ s, idx }));

		if (vertical) {
			return indexed;
		}

		return indexed.reverse();
	});

	const getFretSizeMultiplier = (n: number) => {
		const s = 1 / 2 ** (1 / 12);
		return s ** n;
	};
</script>

<div class="overflow-auto rounded-md bg-gray-200 p-4 dark:bg-slate-600">
	<div
		class="w-min bg-[brown]"
		style={`
			--angle: ${vertical ? 90 : 45}deg; 
			background: linear-gradient(var(--angle), oklab(72.1% 0.029 0.075), oklab(43.5% 0.054 0.063))
		`}
	>
		<div class="flex" class:flex-col={vertical}>
			{#each new Array(fretboard.frets + 1).fill(null) as _, fretIdx (fretIdx)}
				{@const fretSizeMultiplier =
					fretIdx === 0 ? 1 / 3 : variableFretSize ? getFretSizeMultiplier(fretIdx - 1) : 1}

				<div
					class="relative flex"
					class:flex-col={!vertical}
					style={`
						--base-size: 80px;
						--multiplier: ${fretSizeMultiplier};
					`}
					class:w-[calc(var(--base-size)_*_var(--multiplier))]={!vertical}
					class:h-[calc(var(--base-size)_*_var(--multiplier))]={vertical}
				>
					<div
						class={`absolute flex ${vertical ? 'h-[calc(100%_-_8px)]' : 'h-full'} ${vertical ? 'w-full' : 'w-[calc(100%_-_8px)]'} items-center`}
						class:flex-col={!vertical}
					>
						{#each new Array(fretboard.dots[fretIdx - 1] ?? 0).fill(null) as _, idx (idx)}
							<div class="flex flex-grow items-center justify-center">
								<div class="h-4 w-4 rounded-full bg-white"></div>
							</div>
						{/each}
					</div>

					{#each usableStrings as { s: stringPitch, idx } (idx)}
						{@const pitch = CanonicalPitch.applyOffset(stringPitch, fretIdx)}
						{@const fretActivation = stringDecorations[idx][fretIdx]}

						{@const bridge = fretIdx === 0}
						<button
							onclick={() => onClick(idx, fretIdx)}
							class="relative shrink-0"
							class:h-8={!vertical}
							class:w-8={vertical}
						>
							<div
								class={`fret absolute ${bridge ? 'z-20' : ''} ${vertical ? `bottom-0 ${bridge ? 'h-full' : 'h-2'} w-full` : `top-0 right-0 ${bridge ? 'w-full' : 'w-2'} h-full`}`}
								style={`--angle: ${vertical ? 0 : 90}deg; background: ${bridge ? 'var(--bridge)' : 'var(--gradient)'}`}
							></div>
							<div
								class={`string absolute transform ${vertical ? 'bottom-0 left-1/2 h-full w-1 -translate-x-1/2' : 'top-1/2 h-1 w-full -translate-y-1/2'}`}
								style={`--angle: ${vertical ? 90 : 0}deg; background: ${bridge ? 'black' : `var(--gradient)`}`}
							></div>

							{#if fretActivation !== 'none'}
								<div
									class={`absolute top-1/2 left-1/2 z-30 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 ${bridge ? 'scale-70' : ''} transform items-center justify-center rounded-full text-xs`}
									class:bg-gray-200={fretActivation === 'neutral' || fretActivation === 'disabled'}
									class:text-gray-600={fretActivation === 'disabled'}
									class:bg-blue-500={fretActivation === 'active'}
								>
									{Pitch.print(Pitch.fromCanonical(pitch))}
								</div>
							{/if}
						</button>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.string {
		--gradient: linear-gradient(var(--angle), black, white, black);
	}

	.fret {
		--gradient: linear-gradient(var(--angle), black, white, black);
		--bridge: linear-gradient(var(--angle), gray, white 10%, white 50%, white 90%, gray);
	}
</style>
