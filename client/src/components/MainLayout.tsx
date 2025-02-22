import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { useUser } from "../context/UserContext";
import { useEffect } from "react";
import { Skeleton } from "primereact/skeleton";

export default function MainLayout() {
	const { userInfo, setUserInfo, isLoading, setIsLoading } = useUser();

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				setIsLoading(true);
				const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch user profile");
				}

				const data = await response.json();
				setUserInfo(data.profile);
			} catch (error) {
				console.error("Error fetching user profile:", error);
				setUserInfo(null);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUserProfile();
	}, [setUserInfo, setIsLoading]);

	if (isLoading) {
		return (
			<div className="flex justify-content-center align-items-center h-screen">
				<Skeleton height="2.5rem" width="100%" className="border-round-md" />
			</div>
		);
	}

	if (!userInfo) {
		console.log("User not found, redirecting to login");
		window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login`;
		return null;
	}

	return (
		<main>
			<Navbar />
			<div className="flex mx-auto  border-round-md bg-slate-100 max-w-36rem mt-8 mb-2">
				<Outlet />
			</div>
		</main>
	);
}
