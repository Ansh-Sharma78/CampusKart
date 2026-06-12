import axios from 'axios';

let authIntegration = {
  getAccessToken: () => null,
  refreshAccessToken: async () => null,
  onUnauthorized: () => {},
};

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export function setAuthIntegration(integration) {
  authIntegration = integration;
}

apiClient.interceptors.request.use((config) => {
  const accessToken = authIntegration.getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true;
      const refreshedAccessToken = await authIntegration.refreshAccessToken();

      if (refreshedAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
        return apiClient(originalRequest);
      }

      authIntegration.onUnauthorized();
    }

    return Promise.reject(error);
  },
);