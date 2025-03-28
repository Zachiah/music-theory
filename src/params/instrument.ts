import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param: string): param is 'keyboard' | 'fretboard' => {
	return param === 'keyboard' || param === 'fretboard';
}) satisfies ParamMatcher;
