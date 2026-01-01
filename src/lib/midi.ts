import { CanonicalPitch } from './CanonicalPitch';

export type MidiMessage =
	| { tag: 'note-down'; pitch: CanonicalPitch; velocity: number }
	| { tag: 'note-up'; pitch: CanonicalPitch; velocity: number }
	| { tag: 'unknown' };

export const decodeMIDIMessage = (event: MIDIMessageEvent): MidiMessage => {
	if (!event.data) {
		return { tag: 'unknown' };
	}

	if (event.data.length !== 3) {
		return { tag: 'unknown' };
	}

	const isProperNoteUp = (event.data[0] & 0xf0) === 0x80;
	const isNoteDownWithVelocity0 = (event.data[0] & 0xf0) === 0x90 && event.data[2] === 0;
	if (isProperNoteUp || isNoteDownWithVelocity0) {
		return { tag: 'note-up', pitch: decodeMIDIPitch(event.data[1]), velocity: event.data[2] / 127 };
	}

	if ((event.data[0] & 0xf0) === 0x90) {
		return {
			tag: 'note-down',
			pitch: decodeMIDIPitch(event.data[1]),
			velocity: event.data[2] / 127,
		};
	}

	return { tag: 'unknown' };
};

export const decodeMIDIPitch = (byte: number): CanonicalPitch => {
	return CanonicalPitch.applyOffset({ pitchClass: 'C', octave: -1 }, byte);
};

export const logMIDIEvent = (event: MIDIMessageEvent) => {
	if (!event.data) {
		console.log('Empty event');
		return;
	}

	let str = '';
	for (const character of event.data) {
		str += `0x${character.toString(16)} `;
	}
	console.log(str);
};
