import { create } from "zustand";
import { getAnalytics, getFeatureTrend, IAnalyticsData, ITrendItem } from "../api/analytics";

interface AnalyticsState {
  // --- Overview Data ---
  analyticsData: IAnalyticsData | null;
  fetchAnalytics: (loading?:boolean) => Promise<void>;

  // --- Trend Chart Data ---
  trendData: ITrendItem[];
  trendParams: {
    selectedFeature: string;
    granularity: "minute" | "hour" | "day";
    startDate: string;
    endDate: string;
  };
  
  // Actions
  setTrendParam: (key: keyof AnalyticsState["trendParams"], value: any) => void;
  fetchTrend:(loading?:boolean) => Promise<void>;
}
const toInputLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
};

// Helper to get default dates (last 7 days)
const getDefaultDates = () => {
  const year = 2025;

  const fixedMonth = 11; // December (0-indexed → 11 = December)

  // 14:20 = 2:20 PM in 24h format
  const start = new Date(year, fixedMonth, 1, 14, 20);
  const end   = new Date(year, fixedMonth, 8, 14, 15);

  return {
    start: toInputLocal(start),
    end: toInputLocal(end),
  };
};



export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  // Overview
  analyticsData: null,
  fetchAnalytics: async (loading=true) => {
    const res = await getAnalytics(loading);
    if (res.success) {
      set({ analyticsData: res.data });
      
      // Auto-select first feature for trend if not set
      const currentFeature = get().trendParams.selectedFeature;
      if (!currentFeature && res.data.features.length > 0) {
        get().setTrendParam("selectedFeature", res.data.features[0]._id);
      }
    }
  },

  // Trend
  trendData: [],
  trendParams: {
    selectedFeature: "",
    granularity: "minute",
    startDate: getDefaultDates().start,
    endDate: getDefaultDates().end,
  },

  setTrendParam: (key, value) => {
    set((state) => ({
      trendParams: { ...state.trendParams, [key]: value }
    }));
    // Auto-fetch when params change
    get().fetchTrend();
  },

  fetchTrend: async (loading:boolean =true) => {
    const { selectedFeature, startDate, endDate } = get().trendParams;
    
    if (!selectedFeature) return;

    try {
      const res = await getFeatureTrend(selectedFeature, {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },loading);

      if (res.success) {
        set({ trendData: res.data });
      }
    } catch (error) {
      console.error("Failed to fetch trend", error);
    } 
  },
}));