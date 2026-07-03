const SIZE_CLASSES = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-1",
};

const TabButton = ({ active, children, onClick, size = "md", hover = false }) => (
	<button
		type="button"
		onClick={onClick}
		className={`${SIZE_CLASSES[size]} rounded-sm font-bold cursor-pointer ${
			active
				? "bg-[#382798] text-white"
				: `bg-[#333333] text-[#888888]${hover ? " hover:text-white" : ""}`
		}`}>
		{children}
	</button>
);

export default TabButton;
