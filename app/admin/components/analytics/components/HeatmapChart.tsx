"use client";

import { Card, CardHeader, CardBody, Heading, Box, Text } from "@chakra-ui/react";
import { dummyHeatmapData } from "../dummy-data";

export default function HeatmapChart() {
  return (
    <Box display={"flex"} gap={2} flexDirection={"column"} height={"100%"}>  <Heading size="md">Hourly Usage Heatmap</Heading>
      <Box w="100%" h="100%">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} h="100%">
          {dummyHeatmapData.map((day, i) => (
            <Box display={"flex"} flexDirection={"column"} h="100%">
              <Text fontWeight="bold" mb={2}>{day.day}</Text>

              <Box key={i} display="grid" gridTemplateColumns={"1fr"} flex={"1"}>
                {day.hours.map((h, j) => (
                  <Box
                    key={j}
                    bg={`rgba(49, 130, 206, ${h / 12})`}
                    rounded="md"
                  />
                ))}
              </Box></Box>
          ))}
        </Box>
      </Box></Box>
  );
}
