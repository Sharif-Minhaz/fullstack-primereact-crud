import { useState } from "react";

export function usePost<T>(url: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	const postData = async (data: T) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			return await response.json();
		} catch (err) {
			console.error("usePost:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return { postData, loading, error };
}
