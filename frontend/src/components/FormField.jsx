import Input from "./Input";
import Select from "./Select";

const FormField = ({ input, state, dispatch, errors }) => {
	const isDisabled = input.disabled || (state.snapType === "Scan" && input.id === "photoNo");
	const step = input.id === "amount" ? "10" : "1";

	return (
		<div className="mb-5">
			<label htmlFor={input.id} className="block mb-2">
				{input.label}
			</label>
			{input.type === "select" ? (
				<Select
					options={input.options}
					id={input.id}
					dispatch={dispatch}
					value={state[input.id]}
				/>
			) : (
				<Input
					id={input.id}
					type={input.type}
					placeholder={input.placeholder}
					disabled={isDisabled}
					dispatch={dispatch}
					value={isDisabled && input.id === "photoNo" ? "" : state[input.id]}
					step={step}
				/>
			)}
			{errors[input.id] && (
				<p className="text-[#e08b8b] text-sm mt-1 text-left">{errors[input.id]}</p>
			)}
		</div>
	);
};

export default FormField;
