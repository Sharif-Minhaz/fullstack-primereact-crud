import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useLocation } from "react-router";
import { Toast } from "primereact/toast";

export default function Form() {
	const [formData, setFormData] = useState({ title: "", description: "" });
	const location = useLocation();
	const toast = useRef<Toast>(null);

	useEffect(() => {
		if (location.state) {
			setFormData(location.state);
		}
	}, [location]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			const resBuffer = await fetch(`${import.meta.env.VITE_API_BASE_URL}/todos`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const res = await resBuffer.json();
			if (res.success) {
				toast?.current?.show({
					severity: "info",
					summary: "Info",
					detail: "New todo added successfully",
				});
				setFormData({
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
							label="Create"
							size="small"
							icon="pi pi-plus"
							severity="success"
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
