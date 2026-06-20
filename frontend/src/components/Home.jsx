import { useEffect, useState } from "react";
import axios from "axios";
import Card from "./Card";

const Home = () => {
	const [daily, setDaily] = useState({});
	const [monthly, setMonthly] = useState({});
	const [yearly, setYearly] = useState({});

	useEffect(() => {
		const getData = async () => {
			try {
				const [dailyData, monthlyData, yearlyData] = await Promise.all([
					axios.get("http://localhost:5000/summary/daily"),
					axios.get("http://localhost:5000/summary/monthly"),
					axios.get("http://localhost:5000/summary/yearly"),
				]);

				setDaily(dailyData.data);
				setMonthly(monthlyData.data);
				setYearly(yearlyData.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		getData();
	}, []);

	return (
		<div className="flex items-center justify-center gap-10">
			<Card data={daily?.data} />
			<Card data={monthly?.data} />
			<Card data={yearly?.data} />
		</div>
	);
};

export default Home;
