<script lang="ts">
	import Piano from './Piano.svelte';
	import { CanonicalPitchClass } from '$lib/CanonicalPitchClass';
    import {guessChord, GuessedChord} from '$lib/guessChord'

	let notes = $state(Array(CanonicalPitchClass.pitches.length * 3 + 1).fill(false));

    const intervalsWithExtra = $derived(notes.reduce<number[]>((acc, curr) => {
        if (acc.length === 0 && !curr) {
            return []
        }

        if (!curr) {
            return [...acc.slice(0, acc.length - 1), acc[acc.length - 1] + 1]
        }

        return [...acc, 1]
    }, []))

    const intervals = $derived(intervalsWithExtra.slice(0, intervalsWithExtra.length - 1))

    const firstSelected = $derived(CanonicalPitchClass.applyOffset('C', notes.findIndex(n => n)))

    const chord = $derived(guessChord(intervals))
    const chordString = $derived(GuessedChord.print(firstSelected, chord))
</script>

<Piano {notes} start="C" toggle={(idx) => (notes[idx] = !notes[idx])} />

{#if notes.some(n => n)}
    <p class="text-3xl">{chordString}</p>
{/if}
