import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { MouseEvent, useRef, useState } from "react";
import { Link } from "react-router";
import { usePut } from "../hooks/usePut";
import { useDelete } from "../hooks/useDelete";

export default function Todo({
	item,
	refetch,
	loading,
}: {
	item: Todo;
	refetch: () => void;
	loading: boolean;
}) {
	const [checked, setChecked] = useState(item?.status === "completed");
	const toast = useRef<Toast>(null);
	const { updateData } = usePut("/todos");
	const { deleteData } = useDelete("/todos");

	const accept = () => {
		handleDelete();
	};

	const confirm = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation();
		confirmPopup({
			target: event.currentTarget,
			message: "Do you want to delete this record?",
			icon: "pi pi-info-circle",
			defaultFocus: "reject",
			acceptClassName: "p-button-danger",
			accept,
		});
	};

	const handleDelete = async () => {
		try {
			const res = await deleteData(item.id);
			if (res.success) {
				toast.current?.show({
					severity: "info",
					summary: "Info",
					detail: "Todo deleted successfully",
					life: 3000,
				});
				refetch();
			}
		} catch (error: unknown) {
			console.error(error);
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Something went wrong",
				life: 3000,
			});
		}
	};

	const handleStatus = async (e: CheckboxChangeEvent) => {
		try {
			setChecked(e.checked as boolean);
			const res = await updateData(item.id, {
				status: e.checked ? "completed" : "pending",
				title: item.title,
				description: item.description,
			});
			if (!res.success) {
				setChecked(!e.checked);
			}
		} catch (error: unknown) {
			console.error(error);
		}
	};

	return (
		<div>
			<Toast ref={toast} />
			{/* Skeleton Loader for Loading State */}
			{loading ? (
				<div className="flex w-full items-center justify-between p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm">
					<Skeleton shape="circle" size="2rem" />
					<Skeleton width="80%" height="1.5rem" />
					<div className="flex gap-2">
						<Skeleton shape="circle" size="2rem" />
						<Skeleton shape="circle" size="2rem" />
					</div>
				</div>
			) : (
				<div className="flex w-full items-center justify-between p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
					<div className="flex items-center space-x-3">
						<Checkbox checked={checked} onChange={handleStatus} className="w-5 h-5" />
						<h3
							className={`text-lg font-medium ${
								checked ? "line-through text-gray-400" : "text-gray-800"
							} transition-all duration-200`}
						>
							<Link to={`/todo/${item.id}`} className="hover:underline">
								{item.title}
							</Link>
						</h3>
					</div>
					<div className="flex items-center gap-2">
						<Link to={`/manage`} state={item}>
							<Button
								className="!size-[36px]"
								rounded
								text
								raised
								severity="help"
								icon="pi pi-pencil"
								tooltip="Edit"
							/>
						</Link>
						<Button
							onClick={confirm}
							className="!size-[36px]"
							size="small"
							rounded
							icon="pi pi-trash"
							text
							raised
							severity="danger"
							tooltip="Delete"
						/>
					</div>
				</div>
			)}
		</div>
	);
}
