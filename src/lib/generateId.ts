export const generateId = (() => {
	let idx = 0;

	return () => `id-${idx++}`;
})();
