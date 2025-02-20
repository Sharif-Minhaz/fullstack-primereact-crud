import { createContext, useState, ReactNode, useContext } from "react";

interface UserInfo {
	email: string;
	sub: string;
	name: string;
}

interface UserContextType {
	userInfo: UserInfo | null;
	setUserInfo: (user: UserInfo | null) => void;
	isLoading: boolean;
	setIsLoading: (loading: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	return (
		<UserContext.Provider value={{ userInfo, setUserInfo, isLoading, setIsLoading }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}
