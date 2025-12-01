const Select = ({ options, id, dispatch }) => {
	return (
		<>
			<select
				id={id}
				name={id}
				className={`rounded-sm py-2 px-1 cursor-pointer bg-[#333333] w-3xl`}
				required
				onChange={(e) =>
					dispatch({
						type: "UPDATE_FIELD",
						field: e.target.name,
						value: e.target.value,
					})
				}>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</>
	);
};

export default Select;
