import { apiGet } from "./index";

export interface IAction {
    action: string;
    count: number;
}

export interface IFeatureAnalytics {
    _id: string; // e.g., "user", "cart"
    totalCount: number;
    actions: IAction[];
    lastUsed: string;
}

export interface IAnalyticsStats {
    totalEvents: number;
    uniqueFeatures: number;
    uniqueUsers: number;
}

export interface IAnalyticsData {
    statistics: IAnalyticsStats;
    features: IFeatureAnalytics[];
}
const base = "analytics"
export async function getAnalytics() {
    return await apiGet<IAnalyticsData>(`/${base}/v1/overview`, {
        operation: "Analytics fetch", 
    });
}
// --- NEW TYPES FOR TREND ---
export interface ITrendItem {
    _id: string; // ISO Date string or formatted time like "2025-12-05 13:28"
    count: number;
}

export interface ITrendParams {
    startDate?: string;
    endDate?: string;
    granularity?: "hour" | "minute";
    action?: string;
    timezone?: string;
}

export async function getFeatureTrend(featureName: string, params: ITrendParams = {}) {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.append("startDate", params.startDate);
    if (params.endDate) searchParams.append("endDate", params.endDate);
    if (params.granularity) searchParams.append("granularity", params.granularity);
    if (params.action) searchParams.append("action", params.action);
    if (params.timezone) searchParams.append("timezone", params.timezone);

    // Note: ensure operation "Activity fetch" is added to types/axios.d.ts if strict
    return await apiGet<ITrendItem[]>(`/analytics/features/${featureName}/trend?${searchParams.toString()}`, {
        operation: "Activity fetch" as any, 
    });
}