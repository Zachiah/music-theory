import { CanonicalPitch } from './CanonicalPitch';

export type Fretboard = {
	id: string;
	name: string;
	strings: CanonicalPitch[];
	dots: { fretNumber: number; dots: number }[];
	frets: number;
};
