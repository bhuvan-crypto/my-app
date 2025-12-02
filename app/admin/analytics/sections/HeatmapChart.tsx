"use client";

import { Card, CardHeader, CardBody, Heading, Box, Text } from "@chakra-ui/react";
import { dummyHeatmapData } from "../dummy-data";

export default function HeatmapChart() {
  return (
    <Card.Root shadow="lg">
      <CardHeader><Heading size="md">Hourly Usage Heatmap</Heading></CardHeader>
      <CardBody>
                  <Box w="100%" h="300px"> 

        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
          {dummyHeatmapData.map((day, i) => (
            <Box key={i}>
              <Text fontWeight="bold" mb={2}>{day.day}</Text>
              {day.hours.map((h, j) => (
                <Box
                  key={j}
                  bg={`rgba(49, 130, 206, ${h / 12})`}
                  height="20px"
                  rounded="md"
                />
              ))}
            </Box>
          ))}
        </Box>
            </Box>
      </CardBody>
    </Card.Root>
  );
}
