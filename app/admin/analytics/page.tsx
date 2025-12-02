"use client";

import { useState } from "react";
import { Box, Heading, ButtonGroup, Button } from "@chakra-ui/react";

import TimelineChart from "./sections/TimelineChart";
import DeviceChart from "./sections/DeviceChart";
import RadarFeatureChart from "./sections/RadarFeatureChart";
import TopUsersChart from "./sections/TopUsersChart";
import FeatureUsageChart from "./sections/FeatureUsageChart";
import HeatmapChart from "./sections/HeatmapChart";

export default function AnalyticsPage() {
  const [view, setView] =
    useState<"feature" | "timeline" | "device" | "heatmap" | "radar" | "users">("feature");

  return (
    <Box p={8}>
      <Heading mb={6}>Analytics Dashboard</Heading>

      {/* SWITCH BUTTONS */}
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

      {/* CHART VIEW SWITCH */}
      {view === "feature" && <FeatureUsageChart />}
      {view === "timeline" && <TimelineChart />}
      {view === "device" && <DeviceChart />}
      {view === "heatmap" && <HeatmapChart />}
      {view === "radar" && <RadarFeatureChart />}
      {view === "users" && <TopUsersChart />}
    </Box>
  );
}
