import { User, userSchema } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";

export const getAccessToken = async () => {
    if (Platform.OS === "web") {
        return localStorage.getItem("accessToken");
    }
    return await SecureStore.getItemAsync("accessToken");
};

export const getRefreshToken = async () => {
    return await SecureStore.getItemAsync("refreshToken");
}

export const setAccessToken = async (token: string) => {
    if (Platform.OS === "web") {
        localStorage.setItem("accessToken", token);
    } else {
        await SecureStore.setItemAsync("accessToken", token);
    }
};

export const setTokens = async (access: string, refresh: string) => {
    await SecureStore.setItemAsync("accessToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);
};

export const clearTokens = async () => {
    await Promise.all([
		SecureStore.deleteItemAsync("accessToken"),
		SecureStore.deleteItemAsync("refreshToken"),
	]);
};

export const setUser = async (user: User) => {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
}

export const getUser = async (): Promise<User | null> => {
    try {
        let userJson: string | null = null;

        if (Platform.OS === "web") {
            userJson = localStorage.getItem("user");
        } else {
            userJson = await SecureStore.getItemAsync("user");
        }

        if (!userJson) return null;

        const parsed = JSON.parse(userJson);
        return userSchema.parse(parsed);
    } catch (error) {
        console.warn("Failed to load user:", error);
        return null;
    }
};

export const clearUser = async () => {
    await SecureStore.deleteItemAsync("user");
}