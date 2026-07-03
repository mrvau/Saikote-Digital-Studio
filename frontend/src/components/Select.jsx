const Select = ({ options, id, dispatch, value }) => {
	return (
		<select
			id={id}
			name={id}
			value={value}
			className="rounded-sm py-2 px-1 cursor-pointer bg-[#333333] w-3xl"
			required
			onChange={(e) =>
				dispatch({
					type: "UPDATE_FIELD",
					field: e.target.name,
					value: e.target.value,
				})
			}>
			<option value="">Select One</option>
			{options.map((option) => (
				<option key={option} value={option}>
					{option}
				</option>
			))}
		</select>
	);
};

export default Select;
