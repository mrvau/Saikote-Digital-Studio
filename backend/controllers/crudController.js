const parseId = (value) => {
	const id = Number(value);
	return Number.isNaN(id) ? null : id;
};

const hasValidationErrors = (errors) => Object.keys(errors).length > 0;

const sendServerError = (res, message, error) => {
	console.error(message, error);
	res.status(500).json({ success: false, message });
};

export const createCrudController = ({
	resource,
	list,
	getById,
	create,
	update,
	remove,
	validate,
	getListQuery = (query) => query,
}) => {
	const resourceLabel = resource[0].toUpperCase() + resource.slice(1);

	const ensureExisting = (req, res) => {
		const id = parseId(req.params.id);
		if (id === null) {
			res.status(400).json({ success: false, message: "Invalid ID." });
			return null;
		}

		const existing = getById(id);
		if (!existing) {
			res.status(404).json({ success: false, message: `${resourceLabel} not found.` });
			return null;
		}

		return { id, existing };
	};

	return {
		list: (req, res) => {
			try {
				res.json({ success: true, data: list(getListQuery(req.query)) });
			} catch (error) {
				sendServerError(res, `Failed to load ${resource}s.`, error);
			}
		},

		get: (req, res) => {
			try {
				const result = ensureExisting(req, res);
				if (!result) return;
				res.json({ success: true, data: result.existing });
			} catch (error) {
				sendServerError(res, `Failed to load ${resource}.`, error);
			}
		},

		add: (req, res) => {
			try {
				const { errors, data } = validate(req.body);
				if (hasValidationErrors(errors)) {
					return res.status(400).json({ success: false, message: "Validation error", errors });
				}

				const created = create(data);
				res.status(201).json({
					success: true,
					message: `${resourceLabel} saved.`,
					data: created,
				});
			} catch (error) {
				sendServerError(res, `Failed to save ${resource}.`, error);
			}
		},

		edit: (req, res) => {
			try {
				const result = ensureExisting(req, res);
				if (!result) return;

				const { errors, data } = validate(req.body);
				if (hasValidationErrors(errors)) {
					return res.status(400).json({ success: false, message: "Validation error", errors });
				}

				const updated = update(result.id, data);
				res.json({ success: true, message: `${resourceLabel} updated.`, data: updated });
			} catch (error) {
				sendServerError(res, `Failed to update ${resource}.`, error);
			}
		},

		remove: (req, res) => {
			try {
				const result = ensureExisting(req, res);
				if (!result) return;

				remove(result.id);
				res.json({ success: true, message: `${resourceLabel} deleted.` });
			} catch (error) {
				sendServerError(res, `Failed to delete ${resource}.`, error);
			}
		},
	};
};
