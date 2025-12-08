"use client";

import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import type { Order } from "../../../../lib/ordersStore";
import useOrders from "../../../../lib/ordersStore";
import OrderCard from "./OrderCard";
import React from "react";
import OrderCardSkeleton from "./OrderCardSkeleton";
import { useAppLoading } from "@/lib/loadingStore";

export default function CustomerOrders() {
  const orders = useOrders((s) => s.orders ?? []);
  const cancel = useOrders((s) => s.remove);
  const fetch = useOrders((s) => s.fetchOrders);
  const loading = useAppLoading((s) => s.isActionLoading("Order fetching"));
  const isCancelling = useAppLoading((s) => s.isActionLoading("Order delete"));
  React.useEffect(() => {
    fetch();
  }, []);
  return (
    <Box  bg="gray.50" _dark={{ bg: 'gray.900' }} p={4} h={"1/2"} shadow="md" borderRadius="md" w={"full"} >
      <VStack h={"full"} w={"full"}>
        <HStack justify="space-between" mb={8} w={"full"}>
          <Box w={"full"}>
            <Heading size="lg">Your Orders</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm">Recent purchases and order history.</Text>
          </Box>
          <Link href="/customer">
            <Button size="sm">Back</Button>
          </Link>
        </HStack>

        {loading || isCancelling ? (
          <VStack gap={4} align="stretch" w={"full"}>
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </VStack>
        ) : orders.length === 0 ? (
          <Box p={6} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="sm"  w={"full"}>
            <Text>No orders yet.</Text>
          </Box>
        ) : (
          <VStack gap={4} align="stretch" flex={1} overflow={"auto"}  w={"full"}>
            {orders.slice().reverse().map((o: Order) => (
              <OrderCard key={o.id} order={o} onCancel={cancel} />
            ))}
          </VStack>
        )}

      </VStack>
    </Box>
  );
}
