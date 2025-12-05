"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Heading, 
  Box, 
  HStack, 
  createListCollection, 
  Spinner,
  Center,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from "@chakra-ui/react";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { IFeatureAnalytics, ITrendItem, getFeatureTrend } from "@/api/analytics";

interface Props {
  features: IFeatureAnalytics[]; 
}

// Define available time groupings
type Granularity = "minute" | "hour" | "day";

export default function TrendChart({ features }: Props) {
  // 1. Internal State
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [granularity, setGranularity] = useState<Granularity>("hour"); // Default to Hour
  const [data, setData] = useState<ITrendItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 2. Initialize default feature selection
  useEffect(() => {
    if (features.length > 0 && !selectedFeature) {
      setSelectedFeature(features[0]._id);
    }
  }, [features]);

  // 3. Fetch Data Logic
  useEffect(() => {
    async function fetchData() {
      if (!selectedFeature) return;
      
      setLoading(true);
      try {
        const now = new Date();
        const start = new Date();

        // Adjust Date Range based on Granularity for better visualization
        if (granularity === "minute") {
            // Last 6 Hours for minute-level precision (to avoid overcrowding)
            start.setHours(start.getHours() - 6); 
        } else if (granularity === "hour") {
            // Last 7 Days for hourly trends
            start.setDate(start.getDate() - 7); 
        } else if (granularity === "day") {
            // Last 30 Days for daily trends
            start.setDate(start.getDate() - 30); 
        }

        const res = await getFeatureTrend(selectedFeature, {
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        });

        if (res.success) {
          setData(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch trend", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedFeature, granularity]); // Re-fetch when Feature or Granularity changes

  // 4. Dropdown Collections
  const featureList = createListCollection({
    items: features.map((f) => ({ label: f._id, value: f._id })),
  });

  const granularityList = createListCollection({
    items: [
      { label: "By Minute", value: "minute" },
      { label: "By Hour", value: "hour" },
      { label: "By Day", value: "day" },
    ],
  });

  // 5. Transform Data & Formatters
   const chartData = useMemo(() => {
    const groupedMap = new Map<number, number>();

    data.forEach((item) => {
      // 1. Parse the ISO date
      const date = new Date(item._id);

      // 2. Round down the time based on selected granularity
      if (granularity === "day") {
        // Reset hours, minutes, seconds, ms to get pure date (00:00:00)
        date.setHours(0, 0, 0, 0);
      } else if (granularity === "hour") {
        // Reset minutes, seconds, ms (keep hour)
        date.setMinutes(0, 0, 0);
      } else {
        // Minute granularity: just reset seconds/ms
        date.setSeconds(0, 0);
      }

      const timeKey = date.getTime();

      // 3. Sum the counts for this specific time slot
      const currentCount = groupedMap.get(timeKey) || 0;
      groupedMap.set(timeKey, currentCount + item.count);
    });

    // 4. Convert Map back to array and sort by time
    return Array.from(groupedMap.entries())
      .map(([timestamp, count]) => ({
        timestamp,
        count,
        // Optional: keep an ISO string for debugging or tooltips
        _id: new Date(timestamp).toISOString() 
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

  }, [data, granularity]); 
  // Helper to format axis based on current view
  const formatAxisDate = (timestamp: number) => {
    const d = new Date(timestamp);
    if (granularity === "minute") return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (granularity === "hour") return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }); // Day view
  };

  return (
    <Card.Root shadow="lg" height="100%">
      <CardHeader>
        <HStack justify="space-between" width="100%" flexWrap="wrap" gap={4}>
          <Heading size="md">Precise Usage Trend</Heading>
          
          <HStack gap={2}>
            {/* Feature Selector */}
            <Box width="180px">
                <SelectRoot
                collection={featureList}
                value={[selectedFeature]}
                onValueChange={(e) => setSelectedFeature(e.value[0])}
                size="sm"
                disabled={loading && features.length === 0}
                >
                <SelectTrigger>
                    <SelectValueText placeholder="Select feature" />
                </SelectTrigger>
                <SelectContent>
                    {featureList.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                        {item.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </SelectRoot>
            </Box>

            {/* Granularity Selector */}
            <Box width="140px">
                <SelectRoot
                collection={granularityList}
                value={[granularity]}
                onValueChange={(e) => setGranularity(e.value[0] as Granularity)}
                size="sm"
                disabled={loading}
                >
                <SelectTrigger>
                    <SelectValueText placeholder="View By" />
                </SelectTrigger>
                <SelectContent>
                    {granularityList.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                        {item.label}
                    </SelectItem>
                    ))}
                </SelectContent>
                </SelectRoot>
            </Box>
          </HStack>
        </HStack>
      </CardHeader>
      
      <CardBody height="100%">
        <Box w="100%" h="100%" minH="300px" position="relative">
          {loading && (
             <Center position="absolute" inset="0" bg="whiteAlpha.800" zIndex={10}>
                <Spinner color="blue.500" />
             </Center>
          )}
          
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={formatAxisDate}
                stroke="#718096"
                fontSize={12}
                minTickGap={40}
              />
              <YAxis stroke="#718096" fontSize={12} allowDecimals={false} />
              
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                labelFormatter={(label) => new Date(label).toLocaleString()}
              />
              
              <Area
                type="monotone"
                dataKey="count"
                stroke="#3182CE"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTrend)"
                name="Usage"
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}