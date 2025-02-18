import { useState } from "react";
import { Paginator } from "primereact/paginator";

interface PaginationProps {
	totalRecords: number;
	rowsPerPageOptions?: number[];
	onPageChange?: (first: number, rows: number) => void;
}

export default function Pagination({
	totalRecords,
	rowsPerPageOptions = [5, 10, 20],
	onPageChange,
}: PaginationProps) {
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(rowsPerPageOptions[0]); // Default to first option

	const handlePageChange = (event: { first: number; rows: number }) => {
		setFirst(event.first);
		setRows(event.rows);
		if (onPageChange) {
			onPageChange(event.first, event.rows);
		}
	};

	return (
		<div className="mt-3">
			<Paginator
				first={first}
				rows={rows}
				totalRecords={totalRecords}
				rowsPerPageOptions={rowsPerPageOptions}
				onPageChange={handlePageChange}
				className="py-3"
			/>
		</div>
	);
}
