import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  "username": string,
  "id": string,
  "role": string
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setAuth: (access: string, refresh: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setAuth: (access, refresh, user) =>
        set({ accessToken: access, refreshToken: refresh, user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: "auth-storage", // store in localStorage automatically
    }
  )
);
