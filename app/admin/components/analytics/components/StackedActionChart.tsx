"use client";

import { IFeatureAnalytics } from "@/api/analytics";
import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  data: IFeatureAnalytics[];
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // 1. Hue: Multiply by a prime number (e.g., 137) to scatter colors widely 
  //    so similar strings don't end up with similar colors.
  const h = Math.abs(hash * 137) % 360;

  // 2. Saturation: Keep it between 60% and 80% for a nice "pop" without being neon.
  const s = 60 + (Math.abs(hash) % 20); 

  // 3. Lightness: Keep it between 70% and 85% for that "light/pastel" look 
  //    that is still visible against white backgrounds.
  const l = 70 + (Math.abs(hash) % 15); 

  return `hsl(${h}, ${s}%, ${l}%)`;
};
export default function StackedActionChart({ data }: Props) {
  // 1. Transform API data for Recharts
  // Input: { _id: "cart", actions: [{action: "add_to_cart", count: 2}] }
  // Output: { name: "cart", "add_to_cart": 2, total: 4 }
  const chartData = data.map((feature) => {
    const flatObj: any = { name: feature._id, total: feature.totalCount };
    feature.actions.forEach((act) => {
      flatObj[act.action] = act.count;
    });
    return flatObj;
  });

  // 2. Extract all unique action names to create dynamic <Bar> components
  const allActions = Array.from(
    new Set(data.flatMap((d) => d.actions.map((a) => a.action)))
  );

  // Color palette

  return (
    <Card.Root shadow="lg" height="100%">
      <CardHeader>
        <Heading size="md">Feature Action Breakdown</Heading>
      </CardHeader>
      <CardBody height="100%">
        <Box w="100%" h="100%">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Legend />
              {allActions.map((actionKey, index) => (
                <Bar
                  key={actionKey}
                  dataKey={actionKey}
                  stackId="a"
                  fill={stringToColor(actionKey)}
                  name={actionKey.replace(/_/g, ' ')} // Pretty print: "login_user" -> "login user"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardBody>
    </Card.Root>
  );
}