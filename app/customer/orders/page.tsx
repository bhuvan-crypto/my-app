"use client";

import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import type { Order } from "../../lib/ordersStore";
import useOrders from "../../lib/ordersStore";
import OrderCard from "./OrderCard";
import React from "react";
import OrderCardSkeleton from "./OrderCardSkeleton";
import { useAppLoading } from "@/app/api/loadingStore";

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
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} py={12} px={6}>
      <Container maxW="5xl" marginX={"auto"}>
        <HStack justify="space-between" mb={8}>
          <Box>
            <Heading size="lg">Your Orders</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" mt={2}>Recent purchases and order history.</Text>
          </Box>
          <Link href="/customer/dashboard">
            <Button size="sm">Back</Button>
          </Link>
        </HStack>

        {loading || isCancelling ? (
          <VStack gap={4} align="stretch">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </VStack>
        ) : orders.length === 0 ? (
          <Box p={6} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="sm">
            <Text>No orders yet.</Text>
          </Box>
        ) : (
          <VStack gap={4} align="stretch">
            {orders.slice().reverse().map((o: Order) => (
              <OrderCard key={o.id} order={o} onCancel={cancel} />
            ))}
          </VStack>
        )}

      </Container>
    </Box>
  );
}
