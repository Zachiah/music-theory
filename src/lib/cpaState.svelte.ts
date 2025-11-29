import { CanonicalPitchArray, type CanonicalPitch } from './CanonicalPitch';

export const createCpaState = (options: { onChange?: () => void } = {}) => {
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
			options.onChange?.();
		},
		enable(pitch: CanonicalPitch) {
			const foundIndex = getPitchIndex(pitch);
			if (foundIndex === -1) {
				selectedPitches.push(pitch);
			}

			CanonicalPitchArray.sort(selectedPitches);
			options.onChange?.();
		},
		toggle(pitch: CanonicalPitch) {
			const foundIndex = getPitchIndex(pitch);
			if (foundIndex !== -1) {
				selectedPitches.splice(foundIndex, 1);
			} else {
				selectedPitches.push(pitch);
			}

			CanonicalPitchArray.sort(selectedPitches);
			options.onChange?.();
		},
		clear() {
			selectedPitches.length = 0;
			options.onChange?.();
		}
	};
};
