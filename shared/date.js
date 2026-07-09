export const todayString = () => new Date().toLocaleDateString("sv-SE");

export const currentMonthString = () => todayString().slice(0, 7);

export const currentYearString = () => todayString().slice(0, 4);

export const getMonthBounds = (month) => {
	const [year, monthNumber] = month.split("-").map(Number);
	const lastDay = new Date(year, monthNumber, 0).getDate();

	return {
		from: `${month}-01`,
		to: `${month}-${String(lastDay).padStart(2, "0")}`,
	};
};
