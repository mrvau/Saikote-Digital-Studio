const Input = ({ type, placeholder, dispatch, value, id, disabled = false }) => {
	return (
		<input
			id={id}
			type={type}
			name={id}
			className={`outline-none w-3xl rounded-sm py-2 px-2 ${
				disabled && id === "photoNo" ? "cursor-not-allowed bg-[#272727]" : "bg-[#333333] "
			}`}
			placeholder={placeholder}
			disabled={disabled && id === "photoNo"}
			required
			value={value}
			onChange={(e) =>
				dispatch({
					type: "UPDATE_FIELD",
					field: e.target.name,
					value: e.target.value,
				})
			}
		/>
	);
};

export default Input;
