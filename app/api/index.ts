import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "./api-response";
import { useAuthStore } from "../lib/authStore";
import { API_BASE_URL } from "../config";
import { toaster } from "../components/toaster";
import { useAppLoading } from "./loadingStore";
import { IOpTypes } from "../types/axios";

export const api = axios.create({
  baseURL: API_BASE_URL,
  operation: "Ecommerce API",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  const actionKey = config.operation;
  useAppLoading.getState().startAction(actionKey);
  return config;
}, (error) => {
  const actionKey = error.operation;
  useAppLoading.getState().endAction(actionKey);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    const config = response.config;
    const operation = config.operation;
    if (operation && config.method?.toLowerCase() !== "get") {
      toaster.create({
        title: `${operation} successful`,
        description: response.data?.message || "Operation completed successfully",
        type: "success",
      });
    }
    const actionKey = operation || "Action";
    useAppLoading.getState().endAction(actionKey);
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const errResponse = error.response?.data;
    const operation = error.config?.operation as string;
    const errCallback = error.config?.errCallback;
    if (errResponse?.errors && errCallback) {
      for (const [field, message] of Object.entries(errResponse.errors)) {
        errCallback(field, { message });
      }
    }
    const errMsg = errResponse?.message || error.message || "Something went wrong";
    toaster.create({
      title: `${operation} failed`,
      description: errMsg,
      type: "error",
    });
    const actionKey = operation;
    useAppLoading.getState().endAction(actionKey);
    return Promise.resolve({
      data: error.response?.data || { success: false, message: errMsg },
    });
  }
);

// ⭐ Generic typed requests
export async function apiGet<T>(url: string, config: { operation: IOpTypes }
): Promise<ApiResponse<T>> {
  const res = await api.get(url, config);
  return res.data;
}

export async function apiPost<T, B>(
  url: string,
  body: B,
  config: { operation: IOpTypes, errCallback: any }
): Promise<ApiResponse<T>> {
  const res = await api.post(url, body, config);
  return res.data;
}

export async function apiPut<T, B>(
  url: string,
  body: B,
  config: { operation: IOpTypes }
): Promise<ApiResponse<T>> {
  const res = await api.put(url, body, config);
  return res.data;
}

export async function apiDelete<T>(url: string, config: { operation: IOpTypes }
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