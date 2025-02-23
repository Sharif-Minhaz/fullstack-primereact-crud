import { useState } from "react";

export function useMultipartPut<T>(url: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	const updateData = async (id, data: T) => {
		setLoading(true);
		setError(null);
		const formData = new FormData();
		Object.keys(data).forEach((key) => {
			formData.append(key, (data as any)[key]);
		});
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}/${id}`, {
				method: "PUT",
				body: formData,
			});
			return await response.json();
		} catch (err) {
			console.error("Multipart put data:", err);
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return { updateData, loading, error };
}
