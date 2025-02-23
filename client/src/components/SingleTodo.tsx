import { Link, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react";
import { Image } from "primereact/image";

export default function SingleTodo() {
	const { id } = useParams();
	const [item, loading] = useFetch(`/todos/${id}`);
	const [image, setImage] = useState(null);

	const todo = item?.data[0];

	useEffect(() => {
		async function fetchImage() {
			if (todo?.image) {
				const response = await fetch(
					`${import.meta.env.VITE_API_BASE_URL}/todos/files?name=${todo.image}`
				);
				const res = await response.json();
				if (res?.data.fileUrl) {
					setImage(res.data.fileUrl);
				}
			}
		}

		fetchImage();
	}, [todo]);

	return (
		<div className="w-full max-w-36rem mx-auto p-4">
			<Card className="shadow-3 border-round-lg">
				{loading ? (
					<div>
						<Skeleton width="70%" height="2rem" className="mb-4" />
						<Skeleton width="100%" height="1.5rem" className="mb-2" />
						<Skeleton width="90%" height="1.5rem" className="mb-2" />
						<Skeleton width="80%" height="1.5rem" className="mb-2" />
						<Skeleton width="60%" height="1.5rem" className="mb-4" />
						<Skeleton width="30%" height="2rem" />
					</div>
				) : (
					<div>
						<h2 className="text-2xl font-semibold mb-4 mt-0">{todo?.title}</h2>
						<div
							className="max-w-full todo-description"
							dangerouslySetInnerHTML={{ __html: todo?.description || "" }}
						/>
						{image && (
							<div className="card flex justify-content-center">
								<Image
									src={image}
									alt={todo?.title}
									className="mt-4 border-round-md max-w-full"
									preview
									indicatorIcon={<i className="pi pi-search"></i>}
									width="100%"
								/>
							</div>
						)}
						<div className="mt-6">
							<Link to="/">
								<Button
									type="button"
									label="Back"
									size="small"
									icon="pi pi-arrow-left"
									className="border-3xl"
								/>
							</Link>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
