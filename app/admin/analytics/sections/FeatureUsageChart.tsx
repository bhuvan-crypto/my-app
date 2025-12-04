"use client";

import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dummyFeatureData } from "../dummy-data";

export default function FeatureUsageChart() {
  return (
    <>
      <Heading size="md">Feature Usage</Heading>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dummyFeatureData}>
          <XAxis dataKey="feature" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3182CE" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
