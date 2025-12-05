import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  id: string;
  role: string;
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: User;
  
  // New hydration state
  _hasHydrated: boolean; 

  setAuth: (access: string, refresh: string, user: User) => void;
  logout: () => void;
  setHydrated: (state: boolean) => void;
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
      _hasHydrated: false, // Default to false

      setAuth: (access, refresh, user) =>
        set({ accessToken: access, refreshToken: refresh, user }),

      logout: () => set({
        accessToken: '', refreshToken: '', user: {
          username: "",
          id: "",
          role: ""
        }
      }),

      setHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-storage",
      // This callback runs when data has been loaded from localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);