"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Container, Heading, Text, HStack, SimpleGrid } from "@chakra-ui/react";
import CartPopover from "../../components/CartPopover";
import useCart from "../../lib/cartStore";
import useProducts from "../../lib/productsStore";
import type { Product } from "../../lib/products";

export default function CustomerDashboard() {
  const [auth, setAuth] = useState<{ token?: string; user?: { name?: string; email?: string; role?: string } } | null>(null);
  const addToCart = useCart((s) => s.add);
  const products = useProducts((s: any) => s.products ?? []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fakeAuth");
      if (raw) setAuth(JSON.parse(raw));
    } catch (e) {
      setAuth(null);
    }
  }, []);

  function signOut() {
    localStorage.removeItem("fakeAuth");
    window.location.href = "/login";
  }

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
    <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} py={12} px={6} display={"flex"}>
      <Container maxW="5xl" marginX={"auto"}>
        <HStack justify="space-between" mb={8} align="flex-start">
          <Box>
            <Heading size="lg">Hi {auth.user?.name ?? 'Customer'}</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm" mt={2}>Browse our products and add items to your cart.</Text>
          </Box>

          <HStack gap={3}>
            <CartPopover />
            <Link href="/customer/orders">
              <Button size="sm" p={2}>Order History</Button>
            </Link>
            <Button onClick={signOut} colorScheme="red" size="sm" p={2}>Sign out</Button>
          </HStack>
        </HStack>

        <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
          {products.map((p: Product) => (
            <Box key={p.id} p={4} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" shadow="sm">
              <Box h="36" w="full" borderRadius="lg" bgGradient="linear(to-r, rgba(129, 140, 248, 0.1), rgba(168, 85, 247, 0.1))" display="flex" alignItems="center" justifyContent="center" mb={4}>
                <Box textAlign="center">
                  <Text fontSize="lg" fontWeight="medium">{p.name}</Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>{p.description}</Text>
                </Box>
              </Box>

              <Box>
                <Box mb={4}>
                  <Text fontSize="sm" fontWeight="medium">${p.price.toFixed(2)}</Text>
                  <Text fontSize="xs" color="gray.500">In stock</Text>
                </Box>

                <HStack gap={2} w="full">
                  <Button flex={1} size="sm" colorScheme="teal" onClick={() => addToCart(p.id)}>Add</Button>
                  <Button flex={1} size="sm" variant="outline">View</Button>
                </HStack>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
