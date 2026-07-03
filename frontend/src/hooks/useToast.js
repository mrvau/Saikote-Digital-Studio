import { useState, useCallback, useEffect, useRef } from "react";

export const useToast = () => {
	const [toast, setToast] = useState(null);
	const timeoutRef = useRef(null);

	const showToast = useCallback((message, type = "success") => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		setToast({ message, type });
		timeoutRef.current = setTimeout(() => {
			setToast(null);
			timeoutRef.current = null;
		}, 3000);
	}, []);

	useEffect(
		() => () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		},
		[],
	);

	return { toast, showToast };
};
