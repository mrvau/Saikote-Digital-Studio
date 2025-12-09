const Input = ({ type, placeholder, onChange, value, id, disabled = false }) => {
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
			value={value}
			onChange={onChange}
			min={0}
		/>
	);
};

export default Input;
