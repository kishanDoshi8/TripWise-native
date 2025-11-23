import { triggerLogout } from "@/providers/authEvents";
import { getAccessToken, getRefreshToken, setTokens } from '@/utils/secureStore';
import axios from 'axios';
import { apiRoutes } from './apiRoutes';

const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
	const token = await getAccessToken();

	if (token) {
		config.headers = config.headers ?? {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (error) => {
  	return Promise.reject(new Error(error));
});

// Response Interceptor: Refresh token on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { url, method } = apiRoutes.auth.refresh;
        const response = await api.request({
          url,
          method,
          data: { refreshToken },
        });

        const { token: newAccess, refreshToken: newRefresh } = response.data;

        await setTokens(newAccess, newRefresh);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err: any) {
        // let AuthProvider handle a full logout (clearing storage, clearing queries, etc.)
        try {
          await triggerLogout();
        } catch (e) {
          console.warn("triggerLogout failed", e);
        }
        return Promise.reject(new Error(err));
      }
    }

    return Promise.reject(error as Error);
  }
);

export default api;