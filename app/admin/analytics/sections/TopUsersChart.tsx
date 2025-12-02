"use client";

import { Card, CardHeader, CardBody, Heading, Box } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dummyTopUserData } from "../dummy-data";

export default function TopUsersChart() {
    return (
        <Card.Root shadow="lg">
            <CardHeader><Heading size="md">Top Users</Heading></CardHeader>
            <CardBody height="300px">
                <Box w="100%" h="300px">

                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={dummyTopUserData}>
                            <XAxis type="number" />
                            <YAxis dataKey="user" type="category" />
                            <Tooltip />
                            <Bar dataKey="actions" fill="#FF6347" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardBody>
        </Card.Root>
    );
}
