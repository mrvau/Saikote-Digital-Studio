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
		label: "Total Amount",
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

export const KIND_THEMES = {
	order: { badge: "bg-[#1d3a2f] text-[#7ed9a8]", text: "text-[#7ed9a8]", sign: "+", label: "Order" },
	expense: { badge: "bg-[#3a1d1d] text-[#e08b8b]", text: "text-[#e08b8b]", sign: "-", label: "Expense" },
	salary: { badge: "bg-[#3a351d] text-[#e0c97d]", text: "text-[#e0c97d]", sign: "-", label: "Salary" },
};

export const paymentInputs = [
  {
    id: "paymentMethod",
    label: "Payment Method",
    options: ["Cash", "Card", "Internet Banking", "Bank Transfer"],
    type: "select",
  },
  {
    id: "paidAmount",
    label: "Paid Amount (৳)",
    placeholder: "0",
    type: "number",
  },
  {
    id: "dueAmount",
    label: "Due Amount (৳)",
    placeholder: "0",
    type: "number",
    disabled: true,  // Read-only; computed field
  },
  {
    id: "paymentNotes",
    label: "Payment Notes (Optional)",
    placeholder: "e.g., Waiting for cheque clearance",
    type: "text",
  },
];

export const normalizePaymentMethod = (method) => {
  const map = {
    Cash: "cash",
    Card: "card",
    "Internet Banking": "internet_banking",
    "Bank Transfer": "bank_transfer",
  };
  return map[method] || method;
};

export const getPaymentMethodLabel = (method) => {
  const map = {
    cash: "Cash",
    card: "Card",
    internet_banking: "Internet Banking",
    bank_transfer: "Bank Transfer",
  };
  return map[method] || "Unknown";
};
