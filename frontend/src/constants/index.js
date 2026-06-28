const normalPhotoSizes = ["Soft Copy", "Stamp", "Passport", "DV", "3R", "4R", "5R", "6R", "8R", "10R", "10L"];

const labPhotoSizes = ["3R", "4R", "5R", "6R", "8R", "10R", "10L"];

export const normalInputs = [
	{
		id: "snapType",
		label: "Snap Type",
		options: ["Snapshot", "Scan"],
		type: "select",
	},
	{
		id: "photoNo",
		label: "Photo No.",
		placeholder: "DC/",
		type: "text",
	},
	{
		id: "photoSize",
		label: "Photo Size (Print)",
		options: normalPhotoSizes,
		type: "select",
	},
	{
		id: "quantity",
		label: "Quantity",
		placeholder: 4,
		type: "number",
	},
	{
		id: "amount",
		label: "Amount",
		placeholder: 50,
		type: "number",
	},
	{
		id: "printMethod",
		label: "Print Method",
		options: ["Normal", "Lab"],
		type: "select",
	},
];

export const labInputs = [
	{
		id: "printType",
		label: "Print Type",
		options: ["Glossy", "Matte"],
		type: "select",
	},
	{
		id: "deliveryType",
		label: "Delivery Type",
		options: ["Non-Urgent", "Urgent"],
		type: "select",
	},
	{
		id: "labPhotoSize",
		label: "Photo Size (Lab)",
		options: labPhotoSizes,
		type: "select",
	},
	{
		id: "labQuantity",
		label: "Lab Quantity",
		placeholder: 1,
		type: "number",
	},
];

export const expenseInputs = [
	{
		id: "category",
		label: "Category",
		options: ["Salary", "Shop Expense"],
		type: "select"
	},
	{
		id: "expenseType",
		label: "Expense Type",
		placeholder: "Breakfast",
		type: "text",
	},
	{
		id: "amount",
		label: "Amount",
		placeholder: 30,
		type: "number",
	},
];
