const toCsvRow = (values) =>
	values
		.map((value) => {
			const str = String(value ?? "");
			return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
		})
		.join(",");

export const downloadCsv = (filename, rows) => {
	const csv = rows.map(toCsvRow).join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};
