import { CanonicalPitch } from './CanonicalPitch';

export type Fretboard = {
	id: string;
	name: string;
	strings: CanonicalPitch[];
	dots: (null | number)[];
	frets: number;
};
