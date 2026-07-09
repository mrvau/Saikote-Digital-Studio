const ConfirmDialog = ({ open, message, confirmLabel = "Delete", onConfirm, onCancel }) => {
	if (!open) return null;
	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
			<div className="bg-[#222222] rounded-md p-6 w-sm text-center text-[#cccccc]">
				<p className="mb-6">{message}</p>
				<div className="flex gap-3 justify-center">
					<button
						type="button"
						onClick={onCancel}
						className="font-bold bg-[#333333] w-32 py-2 rounded-sm cursor-pointer">
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="font-bold bg-[#382798] w-32 py-2 rounded-sm cursor-pointer">
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
