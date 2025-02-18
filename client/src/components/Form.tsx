import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useLocation } from "react-router";
import { Toast } from "primereact/toast";
import { usePost } from "../hooks/usePost";
import { usePut } from "../hooks/usePut";

export default function Form() {
	const [formData, setFormData] = useState({ id: NaN, title: "", description: "" });
	const { postData } = usePost("/todos");
	const { updateData } = usePut("/todos");
	const location = useLocation();
	const toast = useRef<Toast>(null);

	const isForUpdate = !!location?.state;

	useEffect(() => {
		if (isForUpdate) {
			setFormData(location.state);
		}
	}, [isForUpdate, location.state]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (isForUpdate) {
				const res = await updateData(formData.id, {
					title: formData.title,
					description: formData.description,
				});
				if (res.success) {
					toast?.current?.show({
						severity: "info",
						summary: "Info",
						detail: "Todo updated successfully",
					});
					return;
				}
				toast?.current?.show({
					severity: "error",
					summary: "Error",
					detail: "Something went wrong",
				});
			} else {
				const res = await postData(JSON.stringify(formData));
				if (res.success) {
					toast?.current?.show({
						severity: "info",
						summary: "Info",
						detail: "New todo added successfully",
					});
					setFormData({
						id: NaN,
						title: "",
						description: "",
					});
					return;
				}
				toast?.current?.show({
					severity: "error",
					summary: "Error",
					detail: "Something went wrong",
				});
			}
		} catch (err: unknown) {
			console.error(err);
			toast?.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Something went wrong",
			});
		}
	};

	return (
		<>
			<Toast ref={toast} />
			<form className="p-4 mt-2" onSubmit={handleSubmit}>
				<div className="flex flex-col gap-2">
					<label htmlFor="title">Title</label>
					<InputText
						required
						placeholder="Write a title"
						id="title"
						value={formData.title}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, title: e.target?.value }))
						}
					/>
				</div>
				<div className="flex flex-col gap-2 mt-5">
					<label htmlFor="description">Description</label>
					<Editor
						placeholder="Write a description"
						id="description"
						value={formData.description}
						onTextChange={(e) =>
							setFormData((prev) => ({ ...prev, description: e.htmlValue as string }))
						}
						className="h-[160px] [&>div>.ql-editor]:!bg-white bg-white"
					/>
				</div>
				<div className="flex justify-between gap-2 mt-[84px]">
					<Link to="/">
						<Button type="button" label="Back" size="small" icon="pi pi-arrow-left" />
					</Link>
					<div className="!space-x-2">
						<Button
							type="submit"
							label={isForUpdate ? "Update" : "Save"}
							size="small"
							icon={isForUpdate ? "pi pi-sync" : "pi pi-check"}
							severity={isForUpdate ? "warning" : "success"}
							loading={false}
						/>
						<Link to="/">
							<Button
								type="button"
								label="Cancel"
								size="small"
								icon="pi pi-times"
								severity="danger"
							/>
						</Link>
					</div>
				</div>
			</form>
		</>
	);
}
