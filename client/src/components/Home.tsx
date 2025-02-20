import Todo from "./Todo";
import Pagination from "./Pagination";
import Search from "./Search";
import { Button } from "primereact/button";
import { Link } from "react-router";
import { ConfirmPopup } from "primereact/confirmpopup";
import { useFetch } from "../hooks/useFetch";
import { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import { useDebounce } from "primereact/hooks";
import { useUser } from "../context/UserContext";

export default function Home() {
	const [item, loading, error, refetch] = useFetch("/todos");
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(5);
	const [_searchTerm, debouncedValue, setSearchTerm] = useDebounce("", 400);
	const { userInfo, setUserInfo, isLoading, setIsLoading } = useUser();

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				setIsLoading(true);
				const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch user profile");
				}

				const data = await response.json();
				setUserInfo(data.profile);
			} catch (error) {
				console.error("Error fetching user profile:", error);
				setUserInfo(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserProfile();
	}, [setUserInfo, setIsLoading]);

	if (isLoading) {
		return (
			<div className="flex justify-content-center align-items-center h-screen">
				<Skeleton height="2.5rem" width="100%" className="border-round-md" />
			</div>
		);
	}

	if (!userInfo) {
		console.log("User not found, redirecting to login");
		window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login`;
		return null;
	}

	// Handler for pagination changes
	const handlePageChange = (newFirst: number, newRows: number) => {
		setFirst(newFirst);
		setRows(newRows);
	};

	// Handler for search input changes
	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setFirst(0); // Reset pagination when search changes
	};

	// Filter todos based on the search term (case-insensitive)
	const filteredTodos =
		item?.data?.filter((todo) =>
			todo.title.toLowerCase().includes(debouncedValue.toLowerCase())
		) || [];

	// Apply pagination to the filtered data
	const paginatedData = filteredTodos.slice(first, first + rows);

	if (error) {
		return (
			<div className="flex flex-column align-items-center justify-content-center gap-3 mt-10">
				<h1 className="text-2xl font-semibold text-red-500 text-center">
					Something went wrong
				</h1>
				<Button label="Retry" icon="pi pi-refresh" onClick={refetch} className="mt-3" />
			</div>
		);
	}

	return (
		<div className="w-full mx-auto max-w-48rem p-3 border-round-md">
			{/* Search Bar & Add Button */}
			<div className="flex gap-2 align-align-items-center justify-content-between mb-3">
				{loading ? (
					<Skeleton height="2.5rem" width="100%" className="border-round-md" />
				) : (
					<Search onSearch={handleSearch} />
				)}
				{loading ? (
					<Skeleton width="40px" height="40px" className="border-circle" />
				) : (
					<div className="flex gap-2">
						<Link to="/manage">
							<Button
								icon="pi pi-plus"
								severity="success"
								rounded
								raised
								tooltip="Add Todo"
							/>
						</Link>
					</div>
				)}
			</div>

			<ConfirmPopup />

			{/* Skeleton Loading for Todos */}
			{loading ? (
				<div>
					{Array.from({ length: 5 }).map((_, index) => (
						<div
							key={index}
							className="p-4 mb-2 flex justify-content-between bg-white border-round-lg shadow-1"
						>
							<div className="flex align-items-center gap-3">
								<Skeleton shape="circle" size="2rem" />
								<Skeleton
									width="250px"
									height="1.5rem"
									className="border-round-md"
								/>
							</div>
							<div className="flex gap-2">
								<Skeleton shape="circle" size="2rem" />
								<Skeleton shape="circle" size="2rem" />
							</div>
						</div>
					))}
				</div>
			) : paginatedData.length > 0 ? (
				<>
					{paginatedData.map((todo) => (
						<Todo key={todo.id} item={todo} refetch={refetch} loading={loading} />
					))}
				</>
			) : (
				<div className="text-center">
					<h2 className="text-lg font-medium text-gray-500">No todos found.</h2>
				</div>
			)}

			{/* Pagination */}
			{filteredTodos.length > 0 && (
				<Pagination totalRecords={filteredTodos.length} onPageChange={handlePageChange} />
			)}
		</div>
	);
}
