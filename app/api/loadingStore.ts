import { create } from "zustand";
import { IOpTypes } from "../types/axios";

interface LoadingState {
    globalLoading: boolean;
    loadingMap: Record<IOpTypes, boolean>;

    setGlobalLoading: (value: boolean) => void;
    startAction: (key: IOpTypes) => void;
    endAction: (key: IOpTypes) => void;

    isActionLoading: (key: IOpTypes) => boolean;
}

export const useAppLoading = create<LoadingState>((set, get) => ({
    globalLoading: false,
    loadingMap: {
        "Cart Item add": false,
        "Cart Item delete": false,
        "Cart Item fetch": false,
        "Ecommerce API": false,
        "Login": false,
        "getProducts": false,
    },
    setGlobalLoading: (value) => set({ globalLoading: value }),

    startAction: (key) =>
        set((s) => ({
            loadingMap: { ...s.loadingMap, [key]: true },
        })),

    endAction: (key) =>
        set((s) => ({
            loadingMap: { ...s.loadingMap, [key]: false },
        })),

    isActionLoading: (key) => !!get().loadingMap[key],
}));
