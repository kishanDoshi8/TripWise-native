import { User, userSchema } from '@/types';
import * as SecureStore from 'expo-secure-store';

export const getAccessToken = async () => await SecureStore.getItemAsync("accessToken");
export const getRefreshToken = async () => await SecureStore.getItemAsync("refreshToken");

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
    const userJson = await SecureStore.getItemAsync('user');
    if (userJson) {
        const user = userSchema.parse(JSON.parse(userJson));
        return user;
    }
    return null;
}

export const clearUser = async () => {
    await SecureStore.deleteItemAsync("user");
}