"use client";

import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { dummyDeviceAnalytics } from "../dummy-data";

const COLORS = ["#3182CE", "#D53F8C", "#38A169", "#FFB703"];

export default function DeviceChart() {
  return (
    <Card.Root shadow="lg"  height="100%">
      <CardHeader><Heading size="md">Device Analytics</Heading></CardHeader>
      <CardBody height="100%">
                  <Box w="100%" h="100%"> 

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dummyDeviceAnalytics}
              dataKey="value"
              outerRadius={120}
              label
            >
              {dummyDeviceAnalytics.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}
