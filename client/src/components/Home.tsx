import Todo from "./Todo";
import Pagination from "./Pagination";
import Search from "./Search";
import { Button } from "primereact/button";
import { Link } from "react-router";
import { ConfirmPopup } from "primereact/confirmpopup";
import { useFetch } from "../hooks/useFetch";
import { useState } from "react";

export default function Home() {
	const [item, loading, error, refetch] = useFetch("/todos");
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(5);

	const paginatedData = item?.data?.slice(first, first + rows) || [];

	const handlePageChange = (newFirst: number, newRows: number) => {
		setFirst(newFirst);
		setRows(newRows);
	};
	return (
		<div className="w-full m-4 relative">
			<div className="flex items-center w-full gap-2 mb-4">
				<Search />
				<Link to="/manage">
					<Button icon="pi pi-plus" />
				</Link>
			</div>
			<ConfirmPopup />

			{loading && <div className="text-center my-8">Loading...</div>}

			{(error as Error)?.message && (
				<div className="text-center my-8">{(error as Error).message}, try again later.</div>
			)}

			{paginatedData?.map((item: Todo) => (
				<Todo key={item.id} item={item} refetch={refetch} />
			))}

			<Pagination totalRecords={item?.data?.length || 0} onPageChange={handlePageChange} />
		</div>
	);
}
