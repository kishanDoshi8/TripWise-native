import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { queryKeys } from "@/config/queryKeys";
import { User } from "@/types";
import { clearTokens, getAccessToken, setTokens } from "@/utils/token";
import { useQuery } from "@tanstack/react-query";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface AuthContextProps {
	user: User | null;
	isLoading: boolean;
	token: string | null;
	login: (accessToken: string, refreshToken: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const loadToken = async () => {
			const token = await getAccessToken();
			if (token) setToken(token);
		};
		loadToken();
	}, []);

	const { data: user, isLoading } = useQuery<User>({
		queryKey: queryKeys.user,
		queryFn: async () => {
			const response = await api.request<{ user: User }>(
				apiRoutes.auth.me
			);
			return response.data.user;
		},
		enabled: !!token,
		staleTime: 1000 * 60 * 10,
	});

	const login = async (accessToken: string, refreshToken: string) => {
		await setTokens(accessToken, refreshToken);
		setToken(accessToken);
	};

	const logout = async () => {
		await clearTokens();
		setToken(null);
	};

	const data = useMemo(
		() => ({
			token,
			user: isLoading ? null : user ?? null,
			isLoading,
			login,
			logout,
		}),
		[token, user, isLoading]
	);

	return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be inside AuthProvider");
	return ctx;
};

export default AuthProvider;
