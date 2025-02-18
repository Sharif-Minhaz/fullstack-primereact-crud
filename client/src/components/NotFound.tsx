import { Button } from "primereact/button";
import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="flex flex-col gap-3 items-center justify-center h-screen">
			<h1 className="text-6xl font-bold">404</h1>
			<p className="text-2xl my-3">Opps, Look like this page not found</p>
			<Link to="/">
				<Button icon="pi pi-home" label="Go back home" />
			</Link>
		</div>
	);
}
