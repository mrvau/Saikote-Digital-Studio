import { Link } from "react-router-dom";
import { KIND_THEMES } from "../constants";

const formatDate = (value) => (value ? value.slice(0, 16) : "");

const DocumentRow = ({ doc, onConfirmDelete }) => {
	const theme = KIND_THEMES[doc.kind] || KIND_THEMES.order;

	return (
		<div className="grid grid-cols-[110px_90px_1fr_110px_140px] gap-2 px-5 py-3 items-center border-b border-[#2a2a2a] last:border-none">
			<span className="text-sm text-[#888888]">{formatDate(doc.createdAt)}</span>
			<span className={`text-xs font-bold px-2 py-1 rounded-sm w-fit ${theme.badge}`}>
				{theme.label}
			</span>
			<span>{doc.summary}</span>
			<span className={theme.text}>
				{theme.sign}
				{doc.amount}
			</span>
			<span className="flex gap-3 justify-end">
				<Link
					to={doc.kind === "order" ? `/orders/${doc.id}/edit` : `/expenses/${doc.id}/edit`}
					className="text-[#888888] hover:text-white">
					Edit
				</Link>
				<button
					onClick={() => onConfirmDelete(doc)}
					className="text-[#888888] hover:text-[#e08b8b] cursor-pointer">
					Delete
				</button>
			</span>
		</div>
	);
};

export default DocumentRow;
