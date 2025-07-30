import * as SecureStore from 'expo-secure-store';

export const getAccessToken = async () => await SecureStore.getItemAsync("accessToken");
export const getRefreshToken = async () => await SecureStore.getItemAsync("refreshToken");

export const setTokens = async (access: string, refresh: string) => {
    await SecureStore.setItemAsync("accessToken", access);
    await SecureStore.setItemAsync("refreshToken", refresh);
};

export const clearTokens = async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
};