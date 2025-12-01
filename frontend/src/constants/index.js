const photoSizes = [
	"Select One",
	"Stamp",
	"Passport",
	"DV",
	"3R",
	"4R",
	"5R",
	"6R",
	"8R",
	"10R",
	"10L",
];

export const normalInputs = [
	{
		label: "Snap Type",
		options: ["Select One", "Snapshot", "Scan"],
		type: "select",
		id: "snapType",
	},
	{
		label: "Photo No.",
		placeholder: "DC/",
		type: "text",
		id: "photoNo",
	},
	{
		label: "Photo Size (Print)",
		options: photoSizes,
		type: "select",
		id: "photoSizePrint",
	},
	{
		label: "Quantity",
		placeholder: 0,
		type: "number",
		id: "quantity",
	},
	{
		label: "Amount",
		placeholder: 0,
		type: "number",
		id: "amount",
	},
	{
		label: "Print Type",
		options: ["Select One", "Normal", "Lab"],
		type: "select",
		id: "printType",
	},
];

export const labInputs = [
	{
		label: "Delivery Type",
		options: ["Select One", "Non-Urgent", "Urgent"],
		type: "select",
		id: "deliveryType",
	},
	{
		label: "Photo Size (Lab)",
		options: photoSizes,
		type: "select",
		id: "photoSizeLab",
	},
	{
		label: "Lab Quantity",
		placeholder: 0,
		type: "number",
		id: "labQuantity",
	},
];
