import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { confirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import { MouseEvent, useRef, useState } from "react";
import { Link } from "react-router";

export default function Todo({ item, refetch }: { item: Todo; refetch: () => void }) {
	const [checked, setChecked] = useState(false);
	const toast = useRef<Toast>(null);

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
			const resBuffer = await fetch(`${import.meta.env.VITE_API_BASE_URL}/todos/${item.id}`, {
				method: "DELETE",
			});
			const res = await resBuffer.json();
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

	return (
		<div>
			<Toast ref={toast} />
			<div className="flex w-full items-center justify-between p-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
				<div className="flex w-full items-center space-x-3">
					<Checkbox
						checked={checked}
						onChange={(e) => setChecked(e.checked as boolean)}
						className="w-5 h-5"
					/>
					<h3
						className={`text-lg ${
							checked ? "line-through text-gray-400" : "text-gray-800"
						} transition-all duration-200`}
					>
						<Link to={`/todo/${item.id}`}>{item.title}</Link>
					</h3>
				</div>
				<div className="flex items-center gap-2">
					<Link to={`/manage`} state={item}>
						<Button
							className="!size-[40px]"
							rounded
							text
							raised
							severity="help"
							icon="pi pi-pencil"
						/>
					</Link>
					<Button
						onClick={confirm}
						className="!size-[40px]"
						size="small"
						rounded
						icon="pi pi-trash"
						text
						raised
						severity="danger"
					/>
				</div>
			</div>
		</div>
	);
}
