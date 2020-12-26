export const tableToObjs = <T extends { toString: () => string }>(
	table: Array<Array<T>>,
): Array<Record<string, T>> => {
	const headers = table[0];

	return table
		.slice(1)
		.filter(Array.isArray)
		.map((row) => {
			const obj: Record<string, T> = {};
			for (let i = 0; i < row.length; i++)
				obj[headers[i].toString()] = row[i];
			return obj;
		});
};
