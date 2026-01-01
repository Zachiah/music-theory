import { CanonicalPitch } from './CanonicalPitch';
import Soundfont from 'soundfont-player';

export class Playback {
	#audioContext: AudioContext;
	#engine!: Soundfont.Player;

	constructor(audioContext: AudioContext) {
		this.#audioContext = audioContext;
	}

	async init() {
		this.#engine = await Soundfont.instrument(this.#audioContext, 'acoustic_grand_piano', {
			from: '/samples/sf2/000_Florestan_Piano.sf2',
		});
	}

	now() {
		return this.#audioContext.currentTime;
	}

	playPitch({
		pitch,
		velocity,
		time,
	}: {
		pitch: CanonicalPitch;
		velocity: number;
		time: number;
	}): (stopAt: number) => void {
		if (!this.#engine) {
			throw new Error('Playback engine not initialized');
		}
		const node = this.#engine.play(CanonicalPitch.id(pitch), time, { gain: velocity });
		return (stopAt) => {
			node.stop(stopAt);
		};
	}

	playPitchForLength({
		pitch,
		velocity,
		time,
		length,
	}: {
		pitch: CanonicalPitch;
		velocity: number;
		time: number;
		length: number;
	}) {
		this.playPitch({ pitch, velocity, time })(time + length);
	}

	demoScale(pitches: CanonicalPitch[], time: number) {
		for (const [idx, p] of [...pitches, ...pitches.toReversed().slice(1)].entries()) {
			this.playPitchForLength({ pitch: p, velocity: 1, time: time + idx * 0.25, length: 0.25 });
		}
	}

	async demoChord(pitches: CanonicalPitch[], time: number) {
		await this.#audioContext.resume();
		for (const p of [...pitches]) {
			this.playPitchForLength({ pitch: p, velocity: 1, time, length: 2 });
		}
	}
}

export let playback: Playback = null!;

if (typeof window !== 'undefined') {
	playback = new Playback(new AudioContext());
	playback.init();
}
