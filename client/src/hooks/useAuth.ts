import { useUser } from "../context/UserContext";

export function useAuth() {
	const { userInfo, setUserInfo, setIsLoading } = useUser();

	const logout = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});

			const data = await response.json();

			if (data.success) {
				setUserInfo(null);
				// Redirect to Cognito logout URL
				window.location.href = data.logoutUrl;
			}
		} catch (error) {
			console.error("Error logging out:", error);
		}
	};

	const checkAuth = async () => {
		try {
			setIsLoading(true);
			const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
				credentials: "include",
			});

			if (!response.ok) {
				setUserInfo(null);
				return false;
			}

			const data = await response.json();
			setUserInfo(data.profile);
			return true;
		} catch (error) {
			console.error("Error checking auth:", error);
			setUserInfo(null);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isAuthenticated: !!userInfo,
		userInfo,
		logout,
		checkAuth,
	};
}
