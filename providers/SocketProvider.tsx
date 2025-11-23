// providers/SocketProvider.tsx
import { socketService } from "@/utils/socket";
import React, { createContext, useContext, useEffect } from "react";
import { AppState } from "react-native";
import { useAuth } from "../providers/AuthProvider"; // your auth provider

const SocketContext = createContext(socketService);

export const useSocketService = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			socketService.connect();
		} else {
			socketService.disconnect();
		}

		return () => {
			socketService.disconnect();
		};
	}, [isAuthenticated]);

	// Optionally handle app backgrounding
	useEffect(() => {
		const sub = AppState.addEventListener("change", (next) => {
			if (next === "background") {
				// lightweight: keep connection but stop heavy listeners, or disconnect to save battery
				// socketService.disconnect();
			} else if (next === "active") {
				socketService.connect();
			}
		});
		return () => sub.remove();
	}, []);

	return (
		<SocketContext.Provider value={socketService}>
			{children}
		</SocketContext.Provider>
	);
};
