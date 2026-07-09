const snakeToCamel = (value) => value.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

export const rowToCamel = (row) => {
	if (!row) return row;

	return Object.fromEntries(
		Object.entries(row).map(([key, value]) => [snakeToCamel(key), value]),
	);
};
