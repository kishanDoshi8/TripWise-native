import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { KEYS } from "@/constants/queryKeys";
import { User } from "@/types";
import {
	clearTokens,
	clearUser,
	getAccessToken,
	getUser,
	setTokens,
	setUser,
} from "@/utils/secureStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

interface AuthContextProps {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	token: string | null;
	setLastSelectedTrip: (tripId: string) => void;
	login: (user: User, accessToken: string, refreshToken: string) => void;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [token, setToken] = useState<string | null>(null);
	const queryClient = useQueryClient();

	useEffect(() => {
		const loadData = async () => {
			const token = await getAccessToken();
			if (token) setToken(token);

			const user = await getUser();
			if (user) setUserData(user);
		};
		loadData();
	}, []);

	const { data: user, isLoading } = useQuery<User>({
		queryKey: KEYS.user,
		queryFn: async () => {
			const response = await api.request<{ user: User }>(
				apiRoutes.auth.me
			);
			return response.data.user;
		},
		enabled: !!token,
		staleTime: 1000 * 60 * 10,
	});

	const saveLastTripMutation = useMutation({
		mutationFn: async (tripId: string): Promise<User> => {
			const response = await api.request<{ user: User }>(
				apiRoutes.user.lastSelectedTrip(tripId)
			);
			return response.data.user;
		},
		onSuccess: async (user: User) => {
			queryClient.setQueryData(KEYS.user, user);
			await setUser(user);
		},
	});

	const login = async (
		user: User,
		accessToken: string,
		refreshToken: string
	) => {
		await setTokens(accessToken, refreshToken);
		setToken(accessToken);
		setUserData(user);
	};

	const logout = async () => {
		await clearTokens();
		await clearUser();
		queryClient.removeQueries({ queryKey: KEYS.user });
		setToken(null);
	};

	const setUserData = (user: User) => {
		queryClient.setQueryData(KEYS.user, user);
		setUser(user);
	};

	const setLastSelectedTrip = (tripId: string) => {
		saveLastTripMutation.mutate(tripId);
	};

	const data = useMemo(
		() => ({
			token,
			user: isLoading ? null : user ?? null,
			isLoading,
			isAuthenticated: Boolean(token && user),
			setLastSelectedTrip,
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
