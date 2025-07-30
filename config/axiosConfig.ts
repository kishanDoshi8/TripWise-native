import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/utils/token';
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
        const response = await axios.request({
          url,
          method,
          data: { refreshToken },
        });

        const { accessToken: newAccess, refreshToken: newRefresh } = response.data;

        await setTokens(newAccess, newRefresh);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (err: any) {
        await clearTokens();
        // You could notify the context to logout here
        return Promise.reject(new Error(err));
      }
    }

    return Promise.reject(error as Error);
  }
);

export default api;