"use client";

import { useEffect, useState } from "react";
import { Box, Heading, ButtonGroup, Button, Text, SimpleGrid, Spinner, Center } from "@chakra-ui/react";
import { useAppLoading } from "@/lib/loadingStore";
import { useAnalyticsStore } from "@/lib/analyticsStore";
import DeviceChart from "./components/DeviceChart";
import HeatmapChart from "./components/HeatmapChart";
import RadarFeatureChart from "./components/RadarFeatureChart";
import StackedActionChart from "./components/StackedActionChart";
import TopUsersChart from "./components/TopUsersChart";
import TrendChart from "./components/TrendChart";

export default function AnalyticsPage() {
  const [view, setView] = useState<"feature" | "timeline" | "device" | "heatmap" | "radar" | "users">("feature");
  
  // Use Zustand store
  const { analyticsData, fetchAnalytics } = useAnalyticsStore();
  const isLoading = useAppLoading((s) => s.isActionLoading("Analytics fetch"));

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <Box p={4} w={"100%"} h={"100%"} display={"flex"} flexDirection={"column"} overflow={"auto"} gap={4} >
      <Heading >Analytics Dashboard</Heading>

      {/* Statistics Cards */}
      {analyticsData && (
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
          <Box p={4} bg="white" _dark={{ bg: "gray.800" }} borderRadius="md" shadow="sm" borderWidth="1px">
            <Text fontSize="sm" color="gray.500">Total Events</Text>
            <Heading size="lg">{analyticsData.statistics.totalEvents}</Heading>
          </Box>
          <Box p={4} bg="white" _dark={{ bg: "gray.800" }} borderRadius="md" shadow="sm" borderWidth="1px">
            <Text fontSize="sm" color="gray.500">Unique Features</Text>
            <Heading size="lg">{analyticsData.statistics.uniqueFeatures}</Heading>
          </Box>
          <Box p={4} bg="white" _dark={{ bg: "gray.800" }} borderRadius="md" shadow="sm" borderWidth="1px">
            <Text fontSize="sm" color="gray.500">Active Users</Text>
            <Heading size="lg">{analyticsData.statistics.uniqueUsers}</Heading>
          </Box>
        </SimpleGrid>
      )}

      <ButtonGroup mb={8} flexWrap="wrap" gap={2}>
        <Button variant={view === "feature" ? "solid" : "outline"} onClick={() => setView("feature")}>
          Feature Usage
        </Button>
        <Button variant={view === "timeline" ? "solid" : "outline"} onClick={() => setView("timeline")}>
          Timeline
        </Button>
        <Button variant={view === "device" ? "solid" : "outline"} onClick={() => setView("device")}>
          Devices
        </Button>
        <Button variant={view === "heatmap" ? "solid" : "outline"} onClick={() => setView("heatmap")}>
          Heatmap
        </Button>
        <Button variant={view === "radar" ? "solid" : "outline"} onClick={() => setView("radar")}>
          Comparison
        </Button>
        <Button variant={view === "users" ? "solid" : "outline"} onClick={() => setView("users")}>
          Top Users
        </Button>
      </ButtonGroup>

      <Box flex={"1"} bg="white" borderRadius={"10px"} padding={"20px"}>
        {view === "feature" && (
          isLoading ? <Center h={"full"} ><Spinner size="xl" /></Center> :
            (analyticsData ? <StackedActionChart data={analyticsData.features} /> : <Text>No data available</Text>)
        )}
        {/* Other charts can rely on dummy data until their APIs are ready */}
        {view === "timeline" && analyticsData && <TrendChart  />}
        {view === "device" && <DeviceChart />}
        {view === "heatmap" && <HeatmapChart />}
        {view === "radar" && <RadarFeatureChart />}
        {view === "users" && <TopUsersChart />}
      </Box>
    </Box>
  );
}