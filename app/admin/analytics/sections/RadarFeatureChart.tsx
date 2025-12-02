"use client";

import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer
} from "recharts";
import { dummyRadarData } from "../dummy-data";

export default function RadarFeatureChart() {
  return (
    <Card.Root shadow="lg">
      <CardHeader><Heading size="md">Feature Comparison</Heading></CardHeader>
      <CardBody height="350px">
                  <Box w="100%" h="300px"> 
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dummyRadarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="feature" />
            <Radar dataKey="score" stroke="#3182CE" fill="#3182CE" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}
