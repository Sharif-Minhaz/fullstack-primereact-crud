import { useAuth } from "../hooks/useAuth";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { Link } from "react-router";

function Navbar() {
	const { isAuthenticated, userInfo, logout } = useAuth();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	const handleLogin = () => {
		window.location.href = `${import.meta.env.VITE_API_BASE_URL}/login`;
	};

	return (
		<nav className="z-5 bg-white flex justify-content-between align-items-center fixed top-0 left-0 right-0 bg-primary p-3 shadow-2">
			{/* Brand Section */}
			<Link to="/" className="no-underline">
				<div className="flex align-items-center">
					<img
						src="/vite.svg" // Replace with your logo path
						alt="Prime Todo Logo"
						className="mr-2"
						style={{ height: "40px" }}
					/>
					<span className="font-bold text-2xl">Prime Todo</span>
				</div>
			</Link>

			{/* Auth Section */}
			<div className="flex align-items-center gap-3">
				{isAuthenticated ? (
					<>
						<Chip
							label={`Hello, ${userInfo?.email.split("@")[0]}`}
							icon="pi pi-user"
							className="bg-white-alpha-90 text-primary"
						/>
						<Button
							rounded
							raised
							text
							severity="danger"
							icon="pi pi-sign-out"
							label="Logout"
							outlined
							onClick={handleLogout}
							size="small"
						/>
					</>
				) : (
					<Button
						icon="pi pi-sign-in"
						label="Login"
						rounded
						raised
						text
						outlined
						className="p-button-sm"
						onClick={handleLogin}
					/>
				)}
			</div>
		</nav>
	);
}

export default Navbar;
