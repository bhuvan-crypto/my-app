import { apiPost } from ".";
import { useAuthStore } from "../lib/authStore";


export async function login(username: string, password: string,errCallback?:any) {
    const res = await apiPost<
        {
            accessToken: string; refreshToken: string; user: {
                "username": string,
                "id": string,
                "role": string
            }
        },
        any
    >("/auth/login", { username, password }, {
        operation: "Login",
        errCallback
    });

    if (res.success) {
        useAuthStore.getState().setAuth(
            res.data.accessToken,
            res.data.refreshToken,
            res.data.user
        );
    }

    return res;
}
