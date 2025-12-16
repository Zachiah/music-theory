<script lang="ts">
	import { CanonicalPitchClass } from './CanonicalPitchClass';
	import { musicDisplayOptions } from './musicDisplayOptionsState.svelte';
	import { PitchClass } from './PitchClass';

	const { highlighted, selected }: { highlighted?: CanonicalPitchClass; selected: PitchClass[] } =
		$props();

	const circle: CanonicalPitchClass[] = $derived([
		'C',
		'G',
		'D',
		'A',
		'E',
		'B',
		'Gb',
		'Db',
		'Ab',
		'Eb',
		'Bb',
		'F'
	]);
</script>

<div class="relative size-[150px]" style="--n: {circle.length}">
	<div class="inner-wrapper">
		{#each circle as p, i (p)}
			{@const foundSelected = selected.find((s) => PitchClass.toCanonicalPitchClass(s) === p)}
			<div class="item" style="--i: {i}">
				<div>
					<div
						class="aspect-square rounded-full p-2 font-mono text-sm text-nowrap"
						class:bg-surface-1={!(highlighted === p) && !!foundSelected}
						class:bg-primary={highlighted === p}
					>
						{PitchClass.print(
							foundSelected ?? PitchClass.fromCanonicalPitchClass(p),
							musicDisplayOptions.data
						)}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.inner-wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		translate: -50% -50%;

		--size: 130px;

		width: var(--size);
		height: var(--size);
	}
	.item {
		position: absolute;
		top: 0;
		left: 50%;
		width: 0;
		height: 0;
		transform-origin: 0px calc(var(--size) / 2);

		--rotation: calc(360deg / var(--n) * var(--i));
		rotate: var(--rotation);
	}

	.item > div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		rotate: calc(-1 * var(--rotation));

		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
