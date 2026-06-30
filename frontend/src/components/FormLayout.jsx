import { Link } from "react-router-dom";
import Button from "./Button";
import Toast from "./Toast";

const FormLayout = ({ onSubmit, isEditing, submitText, children, toast }) => {
	return (
		<>
			<form
				onSubmit={onSubmit}
				className="bg-[#222222] px-5 py-4 rounded-md text-[#cccccc] text-center w-5xl">
				
				{children}

				<div className="flex gap-3 justify-center">
					<Button>{submitText}</Button>
					{isEditing && (
						<Link
							to="/documents"
							className="font-bold text-center bg-[#333333] w-3xl my-4 py-1 rounded-sm cursor-pointer flex items-center justify-center">
							Cancel
						</Link>
					)}
				</div>
			</form>
			<Toast toast={toast} />
		</>
	);
};

export default FormLayout;
