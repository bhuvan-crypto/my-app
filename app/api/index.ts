import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "./api-response";
import { useAuthStore } from "../lib/authStore";
import { API_BASE_URL } from "../config";
import { toaster } from "../components/toaster";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ⭐ Attach Access Token Automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},);

// ⭐ Handle 401 → Refresh Token → Retry
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const errResponse = error.response?.data;
    const operation = (error.config as any)?.operation || "Error";
    const errCallback = (error.config as any)?.errCallback;
    if (errResponse?.errors && errCallback) {
      for (const [field, message] of Object.entries(errResponse.errors)) {
        errCallback(field, { message });
      }
    }
    toaster.create({
      title: `${operation} Failed`,
      description: errResponse?.message || "Something went wrong",
      type: "error",
    });
    return Promise.resolve({
      data: error.response?.data,
    });
  }
);

// ⭐ Generic typed requests
export async function apiGet<T>(url: string, config: { operation: string }
): Promise<ApiResponse<T>> {
  const res = await api.get(url, config);
  return res.data;
}

export async function apiPost<T, B>(
  url: string,
  body: B,
  config: { operation: string, errCallback: any }
): Promise<ApiResponse<T>> {
  const res = await api.post(url, body, config);
  return res.data;
}

export async function apiPut<T, B>(
  url: string,
  body: B,
  config: { operation: string }
): Promise<ApiResponse<T>> {
  const res = await api.put(url, body, config);
  return res.data;
}

export async function apiDelete<T>(url: string, operation: string, config: { operation: string }
): Promise<ApiResponse<T>> {
  const res = await api.delete(url, config);
  return res.data;
}
// const original = error.config as any;

// // Prevent infinite loop
// if (error.response?.status === 401 && !original._retry) {
//   original._retry = true;

//   try {
//     const refreshToken = useAuthStore.getState().refreshToken;

//     if (!refreshToken) {
//       useAuthStore.getState().logout();
//       return Promise.reject(error);
//     }

//     // Call refresh token API
//     const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//       refresh_token: refreshToken,
//     });

//     const { accessToken, refreshToken: newRefresh,user } = res.data;

//     // Update store
//     useAuthStore.getState().setAuth(accessToken, newRefresh,user);

//     // Retry original request with new token
//     original.headers.Authorization = `Bearer ${accessToken}`;
//     return api(original);
//   } catch (err) {
//     useAuthStore.getState().logout();
//   }
// }