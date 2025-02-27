import { useEffect, useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useLocation, useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { useMultipartPost } from "../hooks/useMultipartPost";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import { useMultipartPut } from "../hooks/useMultipartPut";

interface FormData {
	id: number;
	title: string;
	description: string;
	image: File | null;
}

export default function Form() {
	const [formData, setFormData] = useState<FormData>({
		id: NaN,
		title: "",
		description: "",
		image: null,
	});
	const [uploadResetKey, setUploadResetKey] = useState(Date.now());
	const { postData, loading } = useMultipartPost("/todos");
	const { updateData, loading: updateLoading } = useMultipartPut("/todos");
	const location = useLocation();
	const toast = useRef<Toast>(null);
	const navigate = useNavigate();
	const [previewImage, setPreviewImage] = useState<string | null>(null);

	const isForUpdate = !!location?.state;

	useEffect(() => {
		if (isForUpdate) {
			setFormData(location.state as FormData);
		}

		if (location?.state?.image) {
			fetchImage();
		}

		async function fetchImage() {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/todos/files?name=${location?.state?.image}`
			);
			const res = await response.json();
			if (res?.data.fileUrl) {
				setPreviewImage(res.data.fileUrl);
			}
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
					image: formData.image,
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
					setUploadResetKey(Date.now());
					setFormData({ id: NaN, title: "", description: "", image: null });
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
								className="w-full"
								disabled={loading}
							/>
						</div>

						<div className="flex flex-column gap-2 mb-3">
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
								style={{ height: "120px" }}
								className="bg-white shadow-1 border-round-md"
								disabled={loading}
							/>
						</div>
						<div className="flex flex-column gap-2">
							<label htmlFor="image" className="font-medium text-gray-600">
								Task Image
							</label>
							{previewImage ? (
								<div>
									<Image
										src={previewImage}
										indicatorIcon={<i className="pi pi-search"></i>}
										alt="Task Image"
										width="100%"
										preview
										className="upload-image border-round-md"
									/>
									<Button
										type="button"
										label="Remove Image"
										size="small"
										severity="danger"
										icon="pi pi-trash"
										className="p-button-text px-0"
										onClick={() => {
											setFormData((prev) => ({
												...prev,
												image: null,
											}));
											setPreviewImage(null);
										}}
									/>
								</div>
							) : (
								<FileUpload
									key={uploadResetKey}
									className="upload-image"
									chooseLabel="Upload a task image"
									mode="advanced"
									accept="image/*"
									customUpload
									emptyTemplate={
										<p className="m-0">
											Drag and drop files to here to upload.
										</p>
									}
									onSelect={(e) => {
										setFormData((prev) => ({
											...prev,
											image: e.files[0],
										}));
									}}
									onRemove={() => {
										setFormData((prev) => ({
											...prev,
											image: null,
										}));
									}}
									disabled={loading}
								/>
							)}
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
									disabled={!formData.title || !formData.description}
									loading={loading || updateLoading}
								/>
								<Button
									onClick={() => navigate(-1)}
									type="button"
									label="Cancel"
									size="small"
									icon="pi pi-times"
									severity="danger"
									className="border-md"
									disabled={loading || updateLoading}
								/>
							</div>
						</div>
					</form>
				</Card>
			</div>
		</>
	);
}
