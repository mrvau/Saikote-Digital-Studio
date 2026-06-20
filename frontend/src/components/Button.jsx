const Button = ({ children = "Save" }) => {
	return (
		<button
			className="font-bold text-center bg-[#382798] w-3xl my-4 py-1 rounded-sm cursor-pointer"
			type="submit">
			{children}
		</button>
	);
};

export default Button;
