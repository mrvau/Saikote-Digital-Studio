import { createCrudController } from "./crudController.js";
import { validateOrder } from "../lib/validate.js";
import {
	createOrder,
	getAllOrders,
	getOrderById,
	updateOrder,
	deleteOrder,
} from "../models/order.model.js";

const orderController = createCrudController({
	resource: "order",
	list: getAllOrders,
	getById: getOrderById,
	create: createOrder,
	update: updateOrder,
	remove: deleteOrder,
	validate: validateOrder,
	getListQuery: ({ from, to }) => ({ from, to }),
});

export const listOrders = orderController.list;
export const getOrder = orderController.get;
export const addOrder = orderController.add;
export const editOrder = orderController.edit;
export const removeOrder = orderController.remove;
