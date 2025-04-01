import * as Tone from 'tone';
import { CanonicalPitch } from './CanonicalPitch';

let synth = $state<Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null>(null);
if (typeof window !== 'undefined') {
	synth = new Tone.PolySynth(Tone.Synth).toDestination();
}

export const useSynth = () => {
	return {
		get data() {
			return synth;
		}
	};
};

export const demoChord = (pitches: CanonicalPitch[]) => {
	const synth = useSynth();

	const printablePitches = pitches.map((cp) => CanonicalPitch.print(cp));

	const now = Tone.now();
	synth.data?.triggerAttackRelease(printablePitches, '4n');

	if (printablePitches.length > 1) {
		for (const [idx, pp] of [
			...printablePitches,
			...[...printablePitches].reverse().slice(1)
		].entries()) {
			synth.data?.triggerAttack(pp, now + 0.5 + idx / 4);
			synth.data?.triggerRelease(pp, now + 1 + idx / 4);
		}
	}
};
