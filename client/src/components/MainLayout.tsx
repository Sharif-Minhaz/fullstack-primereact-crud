import { Outlet } from "react-router";

export default function MainLayout() {
	return (
		<main className="flex min-h-screen mx-auto bg-slate-100 max-w-36rem">
			<Outlet />
		</main>
	);
}
