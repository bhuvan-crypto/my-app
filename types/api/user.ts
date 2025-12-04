import { apiPost } from ".";
import { useAuthStore } from "../../lib/authStore";


export async function login(username: string, password: string, errCallback?: any) {
    const res = await apiPost<
        {
            access_token: string; refreshToken: string; user: {
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
            res.data.access_token,
            res.data.refreshToken,
            res.data.user
        );
    }

    return res;
}
export async function signup(username: string, password: string, role: "customer" | "admin", errCallback?: any) {
    const res = await apiPost<
        {},
        any
    >("/users", { username, password, role }, {
        operation: "Signup",
        errCallback
    });

    return res;
}