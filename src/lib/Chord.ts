import { Intervals } from './Intervals';

export namespace Chord {
	export type ChordDescription = {
		names: string[];
		intervals: Intervals;
		description: string;
	};

	export const chords: ChordDescription[] = [
		{
			names: ['major'],
			intervals: Intervals.createWithSemitones(2, [4, 3]),
			description: ''
		},
		{
			names: ['minor'],
			intervals: Intervals.createWithSemitones(2, [3, 4]),
			description: ''
		},
		{
			names: ['augmented'],
			intervals: Intervals.createWithSemitones(2, [4, 4]),
			description: ''
		},
		{
			names: ['diminished'],
			intervals: Intervals.createWithSemitones(2, [3, 3]),
			description: ''
		},
		{
			names: ['dominant seven'],
			intervals: Intervals.createWithSemitones(2, [4, 3, 3]),
			description: ''
		},
		{
			names: ['major seven'],
			intervals: Intervals.createWithSemitones(2, [4, 3, 4]),
			description: ''
		},
		{
			names: ['minor seven'],
			intervals: Intervals.createWithSemitones(2, [3, 4, 3]),
			description: ''
		},
		{
			names: ['minor major seven'],
			intervals: Intervals.createWithSemitones(2, [3, 4, 4]),
			description: ''
		},
		{
			names: ['half diminished', 'minor seven ♭5'],
			intervals: Intervals.createWithSemitones(2, [3, 3, 4]),
			description: ''
		},
		{
			names: ['diminished'],
			intervals: Intervals.createWithSemitones(2, [3, 3, 3]),
			description: ''
		}
	];
}
