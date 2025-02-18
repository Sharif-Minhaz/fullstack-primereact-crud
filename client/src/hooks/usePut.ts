import { useState } from "react";

export function usePut<T>(url: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	const updateData = async (id: number, data: T) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await response.json();
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return { updateData, loading, error };
}
