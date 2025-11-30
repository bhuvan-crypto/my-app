"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Container, Heading, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";
import useOrders from "../../lib/ordersStore";
import type { Order } from "../../lib/ordersStore";

export default function CustomerOrders() {
  const [auth, setAuth] = useState<{ token?: string; user?: { name?: string; email?: string; role?: string } } | null>(null);
  const orders = useOrders((s) => s.orders ?? []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fakeAuth");
      if (raw) setAuth(JSON.parse(raw));
    } catch (e) {
      setAuth(null);
    }
  }, []);

  if (!auth || auth.user?.role !== "customer") {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" _dark={{ bg: 'gray.900' }} px={6}>
        <Box maxW="md" p={8} textAlign="center" bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="md">
          <Heading size="lg" mb={4}>Access denied</Heading>
          <Text mb={6} color="gray.600" _dark={{ color: 'gray.400' }}>You must sign in as a customer to view this page.</Text>
          <Link href="/login">
            <Button w="full" colorScheme="teal">Sign in</Button>
          </Link>
        </Box>
      </Box>
    );
  }

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

        {orders.length === 0 ? (
          <Box p={6} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="sm">
            <Text>No orders yet.</Text>
          </Box>
        ) : (
          <VStack spacing={4} align="stretch">
            {orders.slice().reverse().map((o: Order) => (
              <Box key={o.id} p={4} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="sm">
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="semibold">Order {o.id}</Text>
                    <Text fontSize="sm" color="gray.500">{new Date(o.createdAt).toLocaleString()}</Text>
                  </Box>
                  <Text fontWeight="semibold">${o.total.toFixed(2)}</Text>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={3}>
                  {o.items.map((it) => (
                    <Box key={it.id} p={3} borderWidth="1px" borderColor="gray.100" borderRadius="md">
                      <Text fontSize="sm" fontWeight="medium">{it.name}</Text>
                      <Text fontSize="xs" color="gray.500">${it.price.toFixed(2)} × {it.qty}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </VStack>
        )}
      </Container>
    </Box>
  );
}
