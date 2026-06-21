const Toast = ({ toast }) => {
	if (!toast) return null;
	return (
		<div
			className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-md font-bold shadow-lg z-50 ${
				toast.type === "error" ? "bg-[#3a1d1d] text-[#e08b8b]" : "bg-[#1d3a2f] text-[#7ed9a8]"
			}`}>
			{toast.message}
		</div>
	);
};

export default Toast;
