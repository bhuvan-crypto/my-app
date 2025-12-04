"use client";

import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dummyTimelineData } from "../dummy-data";

export default function TimelineChart() {
  return (
    <Card.Root shadow="lg" height="100%">
      <CardHeader><Heading size="md">Weekly Activity</Heading></CardHeader>
      <CardBody height="100%">
                  <Box w="100%" h="100%"> 
        
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dummyTimelineData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="activity" stroke="#FF5733" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}
