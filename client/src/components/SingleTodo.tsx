import { Link, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export default function SingleTodo() {
	const { id } = useParams();
	const [item, loading] = useFetch(`/todos/${id}`);

	const todo = item?.data[0];

	return (
		<div className="w-full max-w-3xl mx-auto p-4">
			<Card className="shadow-lg rounded-lg">
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
						<h2 className="text-2xl font-semibold mb-4">{todo?.title}</h2>
						<div
							className="prose max-w-none"
							dangerouslySetInnerHTML={{ __html: todo?.description || "" }}
						/>
						<div className="mt-6">
							<Link to="/">
								<Button
									type="button"
									label="Back"
									size="small"
									icon="pi pi-arrow-left"
									className="!rounded-full"
								/>
							</Link>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}
