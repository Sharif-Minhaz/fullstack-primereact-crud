import { useState } from "react";

export function useDelete(url: string) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<unknown | null>(null);

	const deleteData = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}/${id}`, {
				method: "DELETE",
			});
			return await response.json();
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	return { deleteData, loading, error };
}
