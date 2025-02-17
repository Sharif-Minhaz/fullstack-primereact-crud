import { Outlet } from "react-router";

export default function MainLayout() {
	return (
		<main className="flex min-h-screen mx-auto max-w-xl bg-slate-100">
			<Outlet />
		</main>
	);
}
