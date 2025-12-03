import { CanonicalPitchArray, type CanonicalPitch } from './CanonicalPitch';

export const createCpaState = (
	options: {
		onChange?: (
			op: { tag: 'enable' | 'disable' | 'toggle'; pitch: CanonicalPitch } | { tag: 'clear' }
		) => void;
	} = {}
) => {
	const selectedPitches: CanonicalPitchArray = $state([]);

	const getPitchIndex = (pitch: CanonicalPitch) => {
		return selectedPitches.findIndex(
			(p) => p.pitchClass === pitch.pitchClass && p.octave === pitch.octave
		);
	};

	return {
		get selected() {
			return selectedPitches;
		},
		disable(pitch: CanonicalPitch) {
			const foundIndex = getPitchIndex(pitch);
			if (foundIndex !== -1) {
				selectedPitches.splice(foundIndex, 1);
			}

			CanonicalPitchArray.sort(selectedPitches);
			options.onChange?.({ tag: 'disable', pitch });
		},
		enable(pitch: CanonicalPitch) {
			const foundIndex = getPitchIndex(pitch);
			if (foundIndex === -1) {
				selectedPitches.push(pitch);
			}

			CanonicalPitchArray.sort(selectedPitches);
			options.onChange?.({ tag: 'enable', pitch });
		},
		toggle(pitch: CanonicalPitch) {
			const foundIndex = getPitchIndex(pitch);
			if (foundIndex !== -1) {
				selectedPitches.splice(foundIndex, 1);
			} else {
				selectedPitches.push(pitch);
			}

			CanonicalPitchArray.sort(selectedPitches);
			options.onChange?.({ tag: 'toggle', pitch });
		},
		clear() {
			selectedPitches.length = 0;
			options.onChange?.({ tag: 'clear' });
		}
	};
};
