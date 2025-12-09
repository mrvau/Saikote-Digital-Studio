const Select = ({ options, id, onChange }) => {
	return (
		<select
			id={id}
			name={id}
			className={`rounded-sm py-2 px-1 cursor-pointer bg-[#333333] w-3xl`}
			required
			onChange={onChange}>
			{options.map((option, index) => (
				<option key={index} value={option}>
					{option}
				</option>
			))}
		</select>
	);
};

export default Select;
