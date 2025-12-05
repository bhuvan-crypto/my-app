"use client";

import { useAppLoading } from "@/api/loadingStore";
import { Order } from "@/lib/ordersStore";
import { Box, HStack, Text, SimpleGrid, Button } from "@chakra-ui/react";

interface OrderCardProps {
  order: Order;
  onCancel: (orderId: string) => void;
}

export default function OrderCard({ order, onCancel }: OrderCardProps) {
  return (
    <Box
      key={order.id}
      p={4}
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRadius="md"
      shadow="sm"
      borderWidth="1px"
      borderColor="gray.200"
    >
      <HStack justify="space-between" mb={3}>
        <Box>
          <Text fontWeight="semibold">Order {order.id}</Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(order.createdAt).toLocaleString()}
          </Text>
        </Box>

        <Box textAlign="right">
          <Text fontWeight="semibold">${order.total.toFixed(2)}</Text>

          <Button
            size="xs"
            colorScheme="red"
            mt={2}
            onClick={() => onCancel(order.id)}
          >
            Cancel
          </Button>
        </Box>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        {order.items.map((it) => (
          <Box
            key={it.id}
            p={3}
            borderWidth="1px"
            borderColor="gray.100"
            borderRadius="md"
          >
            <Text fontSize="sm" fontWeight="medium">{it.name}</Text>
            <Text fontSize="xs" color="gray.500">
              ${it.price.toFixed(2)} × {it.qty}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
