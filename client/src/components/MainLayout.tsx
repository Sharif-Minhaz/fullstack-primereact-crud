import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function MainLayout() {
	return (
		<main>
			<Navbar />
			<div className="flex mx-auto  border-round-md bg-slate-100 max-w-36rem mt-8 mb-2">
				<Outlet />
			</div>
		</main>
	);
}
