import { useState } from "react";

export function useMultipartPost<T>(url: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	const postData = async (data: T) => {
		setLoading(true);
		setError(null);
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, (data as any)[key]);
		});
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
				method: "POST",
				body: formData,
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
