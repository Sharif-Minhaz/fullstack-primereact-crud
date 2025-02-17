import { useState, useEffect, useCallback } from "react";

export interface IFetchData {
	success: boolean;
	data: Todo[];
}

export function useFetch(url: string): [IFetchData | null, boolean, unknown | null, () => void] {
	const [data, setData] = useState<IFetchData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<unknown | null>(null);

	const fetchData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`);
			const jsonData = await response.json();
			setData(jsonData);
		} catch (error) {
			setError(error);
		} finally {
			setLoading(false);
		}
	}, [url]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return [data, loading, error, fetchData];
}
