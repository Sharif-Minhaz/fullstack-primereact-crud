import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useLocation } from "react-router";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
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
			let res;
			if (isForUpdate) {
				res = await updateData(formData.id, {
					title: formData.title,
					description: formData.description,
				});
			} else {
				const { id, ...rest } = formData;
				console.log(id);
				res = await postData(rest);
			}

			if (res.success) {
				toast?.current?.show({
					severity: "success",
					summary: "Success",
					detail: isForUpdate
						? "Todo updated successfully"
						: "New todo added successfully",
				});
				if (!isForUpdate) {
					setFormData({ id: NaN, title: "", description: "" });
				}
			} else {
				throw new Error("Something went wrong");
			}
		} catch (err) {
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
			<div className="flex justify-content-center p-4">
				<Card className="w-full max-w-2xl shadow-3">
					<h2 className="text-xl font-semibold text-gray-700 mb-4 mt-0">
						{isForUpdate ? "Update Todo" : "Create a New Todo"}
					</h2>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-column gap-2 mb-3">
							<label htmlFor="title" className="font-medium text-gray-600">
								Title
							</label>
							<InputText
								required
								placeholder="Write a title..."
								id="title"
								value={formData.title}
								onChange={(e) =>
									setFormData((prev) => ({ ...prev, title: e.target?.value }))
								}
								className=" w-full"
							/>
						</div>

						<div className="flex flex-column gap-2">
							<label htmlFor="description" className="font-medium text-gray-600">
								Description
							</label>
							<Editor
								placeholder="Write a description..."
								id="description"
								value={formData.description}
								onTextChange={(e) =>
									setFormData((prev) => ({
										...prev,
										description: e.htmlValue as string,
									}))
								}
								style={{ height: "180px" }}
								className="bg-white shadow-1 border-round-md"
							/>
						</div>

						<div className="flex justify-content-between align-items-center mt-3">
							<Link to="/">
								<Button
									type="button"
									label="Back"
									size="small"
									icon="pi pi-arrow-left"
									className="p-button-text px-0"
								/>
							</Link>
							<div>
								<Button
									type="submit"
									label={isForUpdate ? "Update" : "Save"}
									size="small"
									icon={isForUpdate ? "pi pi-sync" : "pi pi-check"}
									severity={isForUpdate ? "warning" : "success"}
									className="border-md mr-2"
								/>
								<Link to="/">
									<Button
										type="button"
										label="Cancel"
										size="small"
										icon="pi pi-times"
										severity="danger"
										className="border-md"
									/>
								</Link>
							</div>
						</div>
					</form>
				</Card>
			</div>
		</>
	);
}
