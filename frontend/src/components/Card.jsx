import React from "react";

const Card = ({ data }) => {
	return (
		<div className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-sm">
			<h2 className="text-2xl font-bold mb-4 text-white">Date: {data?.date}</h2>
		</div>
	);
};

export default Card;
