import { CanonicalPitch } from './CanonicalPitch';
import { Pitch } from './Pitch';

export class Playback {
	#audioContext: AudioContext;
	#samples: Map<string, AudioBuffer>;

	constructor(audioContext: AudioContext) {
		this.#audioContext = audioContext;
		this.#samples = new Map();
	}

	async loadSamples() {
		const samplePitches = CanonicalPitch.getRangeInclusive(
			{ pitchClass: 'B', octave: 0 },
			{ pitchClass: 'C', octave: 8 }
		);

		this.#samples = new Map(
			await Promise.all(
				samplePitches.map(async (p) => {
					const printed = Pitch.print(Pitch.fromCanonical(p)).replaceAll('♭', 'b');

					const res = await fetch(`/samples/piano/${printed}.mp3`);
					const arrayBuffer = await res.arrayBuffer();
					const audioBuffer = await this.#audioContext.decodeAudioData(arrayBuffer);

					return [printed, audioBuffer] as const;
				})
			)
		);
	}

	now() {
		return this.#audioContext.currentTime;
	}

	playPitch(pitch: CanonicalPitch, time: number): (stopAt: number) => void {
		const pitchString = Pitch.print(Pitch.fromCanonical(pitch)).replaceAll('♭', 'b');
		const audioBuffer = this.#samples.get(pitchString);
		if (!audioBuffer) {
			throw new Error(`Can't play pitch ${pitchString}`);
		}

		const source = this.#audioContext.createBufferSource();
		source.buffer = audioBuffer;

		const gain = this.#audioContext.createGain();
		source.connect(gain).connect(this.#audioContext.destination);

		gain.gain.setValueAtTime(0, time);
		gain.gain.setTargetAtTime(1, time, 0.002);

		source.start(time);

		return (stopAt) => {
			gain.gain.setTargetAtTime(0, stopAt, 0.005);

			source.stop(stopAt);
		};
	}

	playPitchForLength(pitch: CanonicalPitch, time: number, length: number) {
		this.playPitch(pitch, time)(time + length);
	}

	demoScale(pitches: CanonicalPitch[], time: number) {
		for (const [idx, p] of [...pitches, ...pitches.toReversed().slice(1)].entries()) {
			this.playPitchForLength(p, time + idx * 0.25, 0.25);
		}
	}

	async demoChord(pitches: CanonicalPitch[], time: number) {
		await this.#audioContext.resume();
		for (const p of [...pitches]) {
			this.playPitchForLength(p, time, 2);
		}
	}
}

export let playback: Playback = null!;

if (typeof window !== 'undefined') {
	playback = new Playback(new AudioContext());
	playback.loadSamples();
}
