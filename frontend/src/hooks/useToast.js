import { useState, useCallback, useRef } from "react";

export const useToast = () => {
	const [toast, setToast] = useState(null);
	const timeoutRef = useRef(null);

	const showToast = useCallback((message, type = "success") => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setToast({ message, type });
		timeoutRef.current = setTimeout(() => setToast(null), 3000);
	}, []);

	return { toast, showToast };
};
