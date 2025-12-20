import { Intervals } from './Intervals';

export type ScaleName =
	| { tag: 'plain'; name: string }
	| { tag: 'mode'; name: string; number: number };

export namespace ScaleName {
	export const print = (n: ScaleName) => {
		if (n.tag === 'plain') {
			return n.name;
		}

		return `${n.name} mode ${n.number}`;
	};
}

export type ScaleDescription = {
	slug: string;
	intervals: Intervals;
	names: ScaleName[];
	description: string;
};
export namespace ScaleDescription {
	const generateModeDescriptions = (
		base: ScaleDescription,
		modes: { name: string | string[]; description: string }[],
	): ScaleDescription[] => {
		return [
			base,
			...modes.map<ScaleDescription>((mode, idx) => {
				const modeNameList = typeof mode.name === 'string' ? [mode.name] : mode.name;
				return {
					slug: (Array.isArray(mode.name) ? mode.name[0] : mode.name)
						.replaceAll(' ', '-')
						.replaceAll('♭', 'b'),
					intervals: Intervals.rotate(base.intervals, idx + 2),
					names: [
						...modeNameList.map<ScaleName>((n) => ({ tag: 'plain', name: n })),
						{
							tag: 'mode',
							name: base.names[0].name,
							number: idx + 2 + (base.names[0].tag === 'mode' ? base.names[0].number : 0),
						},
					],
					description: mode.description,
				};
			}),
		];
	};

	export const scales: ScaleDescription[] = [
		...generateModeDescriptions(
			{
				slug: 'major',
				description:
					'The major scale is the most common scale in all of western music. All of western music is built around the major scale and described in terms of it. The white keys on a piano starting from C are the C major scale.',
				intervals: Intervals.createWithSemitones(1, [2, 2, 1, 2, 2, 2]),
				names: [
					{ tag: 'plain', name: 'major' },
					{ tag: 'plain', name: 'ionian' },
				],
			},
			[
				{ name: 'dorian', description: '' },
				{ name: 'phrygian', description: '' },
				{ name: 'lydian', description: '' },
				{ name: 'mixolydian', description: '' },
				{ name: ['minor', 'aeolian'], description: '' },
				{ name: 'locrian', description: '' },
			],
		),
		...generateModeDescriptions(
			{
				slug: 'harmonic-minor',
				names: [{ tag: 'plain', name: 'harmonic minor' }],
				intervals: Intervals.createWithSemitones(1, [2, 1, 2, 2, 1, 3]),
				description: '',
			},
			[
				{ name: 'locrian ♮6', description: '' },
				{ name: ['ionian augmented', 'major augmented', 'ionian ♯5', 'major ♯5'], description: '' },
				{ name: ['ukranian dorian', 'dorian ♯4'], description: '' },
				{ name: 'phrygian Dominant', description: '' },
				{ name: ['lydian ♯2', 'lydian ♯9'], description: '' },
				{ name: ['altered diminished', 'locrian ♭4 ♭♭7'], description: '' },
			],
		),
		...generateModeDescriptions(
			{
				slug: 'melodic-minor',
				names: [{ tag: 'plain', name: 'melodic minor' }],
				intervals: Intervals.createWithSemitones(1, [2, 1, 2, 2, 2, 2]),
				description: '',
			},
			[
				{ name: ['dorian ♭2', 'phrygian ♮6'], description: '' },
				{ name: ['lydian augmented', 'lydian ♯5'], description: '' },
				{ name: ['lydian dominant', 'mixolydian ♯4', 'mixolydian ♯11'], description: '' },
				{ name: ['aeolian dominant', 'mixolydian ♭6'], description: '' },
				{ name: ['aeolian ♭5', 'locrian ♮2', 'locrian ♮9'], description: '' },
				{ name: ['altered', 'altered dominant', 'super-locrian', 'locrian ♭4'], description: '' },
			],
		),
		{
			slug: 'blues',
			names: [
				{ tag: 'plain', name: 'blues' },
				{ tag: 'plain', name: 'minor blues' },
			],
			intervals: [
				{ semitones: 3, letters: 2 },
				{ semitones: 2, letters: 1 },
				{ semitones: 1, letters: 0 },
				{ semitones: 1, letters: 1 },
				{ semitones: 3, letters: 2 },
			],
			description: '',
		},
		{
			slug: 'major-blues',
			names: [{ tag: 'plain', name: 'major blues' }],
			intervals: [
				{ semitones: 2, letters: 1 },
				{ semitones: 1, letters: 1 },
				{ semitones: 1, letters: 0 },
				{ semitones: 3, letters: 2 },
				{ semitones: 2, letters: 1 },
			],
			description: '',
		},
		...generateModeDescriptions(
			{
				slug: 'pentatonic',
				names: [
					{ tag: 'plain', name: 'pentatonic' },
					{ tag: 'plain', name: 'major pentatonic' },
				],
				intervals: [
					{ semitones: 2, letters: 1 },
					{ semitones: 2, letters: 1 },
					{ semitones: 3, letters: 2 },
					{ semitones: 2, letters: 1 },
				],
				description: '',
			},
			[
				{ name: 'suspended egyptian pentatonic', description: '' },
				{ name: 'blues minor pentatonic', description: '' },
				{ name: 'blues major pentatonic', description: '' },
				{ name: 'minor pentatonic', description: '' },
			],
		),
		// TODO: Modes of double harm major
		// TODO: Modes of harm major
	];
}
