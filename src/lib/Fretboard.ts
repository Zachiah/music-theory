import { CanonicalPitch } from './CanonicalPitch';

export type Fretboard = {
	name: string;
	strings: CanonicalPitch[];
	dots: (null | number)[];
	frets: number;
};
