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
  Select, 
  Input, 
  Text,
  Stack
} from "@chakra-ui/react";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { IFeatureAnalytics, ITrendItem, getFeatureTrend } from "@/api/analytics";

interface Props {
  features: IFeatureAnalytics[]; 
}

type Granularity = "minute" | "hour" | "day";

export default function TrendChart({ features }: Props) {
  // 1. Internal State
  const [selectedFeature, setSelectedFeature] = useState<string>("");
  const [granularity, setGranularity] = useState<Granularity>("hour"); 
  
  // Initialize dates (default to last 7 days)
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 16); 
  });
  const [endDate, setEndDate] = useState<string>(() => 
    new Date().toISOString().slice(0, 16)
  );

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
        const res = await getFeatureTrend(selectedFeature, {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
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
  }, [selectedFeature, granularity, startDate, endDate]); 

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
      const date = new Date(item._id);

      if (granularity === "day") {
        date.setHours(0, 0, 0, 0);
      } else if (granularity === "hour") {
        date.setMinutes(0, 0, 0);
      } else {
        date.setSeconds(0, 0);
      }

      const timeKey = date.getTime();
      const currentCount = groupedMap.get(timeKey) || 0;
      groupedMap.set(timeKey, currentCount + item.count);
    });

    return Array.from(groupedMap.entries())
      .map(([timestamp, count]) => ({
        timestamp,
        count,
        _id: new Date(timestamp).toISOString() 
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

  }, [data, granularity]); 
  
  const formatAxisDate = (timestamp: number) => {
    const d = new Date(timestamp);
    if (granularity === "minute") return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (granularity === "hour") return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Card.Root shadow="lg" height="100%">
      <CardHeader>
        <Stack direction={{ base: "column", lg: "row" }} justify="space-between" align="center" gap={4}>
          <Heading size="md" whiteSpace="nowrap">Precise Usage Trend</Heading>
          
          <HStack gap={3} flexWrap="wrap" justify="flex-end" width="100%">
             {/* Feature Selector */}
             <Box width={{ base: "100%", sm: "180px" }}>
                <Select.Root
                  collection={featureList}
                  value={[selectedFeature]}
                  onValueChange={(e) => setSelectedFeature(e.value[0])}
                  size="sm"
                  disabled={loading && features.length === 0}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select feature" />
                    </Select.Trigger>
                  </Select.Control>

                  <Select.Positioner>
                    <Select.Content>
                      {featureList.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
            </Box>

            {/* Granularity Selector */}
            <Box width={{ base: "100%", sm: "140px" }}>
                <Select.Root
                  collection={granularityList}
                  value={[granularity]}
                  onValueChange={(e) => setGranularity(e.value[0] as Granularity)}
                  size="sm"
                  disabled={loading}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="View By" />
                    </Select.Trigger>
                  </Select.Control>

                  <Select.Positioner>
                    <Select.Content>
                      {granularityList.items.map((item) => (
                        <Select.Item item={item} key={item.value}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
            </Box>

            {/* Date Pickers (Native but styled) */}
            <HStack 
              gap={2} 
              bg="gray.50" 
              _dark={{ bg: "gray.800" }} 
              p={1} 
              px={3}
              borderRadius="md" 
              borderWidth="1px" 
              borderColor="gray.200" 
              height="40px"
            >
              <Input 
                  type="datetime-local" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  size="xs"
                  width="fit-content"
                  variant="flushed" 
                  border="none"
                  _focus={{ ring: "none", border: "none" }}
                  max={endDate}
                  css={{ 
                    "::-webkit-calendar-picker-indicator": { cursor: "pointer", filter: "invert(0.5)" },
                    // Remove default Input border/outline from variant="flushed" override
                    borderBottom: "none !important"
                  }}
              />
              <Text fontSize="xs" color="gray.500" fontWeight="bold">TO</Text>
              <Input 
                  type="datetime-local" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  size="xs"
                  width="fit-content"
                  variant="flushed"
                  border="none"
                  _focus={{ ring: "none", border: "none" }}
                  min={startDate}
                  css={{ 
                    "::-webkit-calendar-picker-indicator": { cursor: "pointer", filter: "invert(0.5)" },
                    borderBottom: "none !important"
                  }}
              />
            </HStack>
          </HStack>
        </Stack>
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