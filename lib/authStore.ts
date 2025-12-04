import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  "username": string,
  "id": string,
  "role": string
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: User;

  setAuth: (access: string, refresh: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      user: {
        username: "",
        id: "",
        role: ""
      },

      setAuth: (access, refresh, user) =>
        set({ accessToken: access, refreshToken: refresh, user }),

      logout: () => set({
        accessToken: '', refreshToken: '', user: {
          username: "",
          id: "",
          role: ""
        }
      }),
    }),
    {
      name: "auth-storage", // store in localStorage automatically
    }
  )
);



