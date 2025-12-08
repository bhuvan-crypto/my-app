"use client";
import { useAuthStore } from "@/lib/authStore";
import { Box, Button, Container, Heading, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect } from "react";
import CartPopover from "../../components/CartPopover";
import useProducts from "../../lib/productsStore";
import { ProductCard } from "../admin/components/ProductCard";
import { ProductSkeleton } from "../admin/components/ProductSkeleton";
import { useAppLoading } from "@/lib/loadingStore";
import CustomerOrders from "./components/orders/page";

export default function CustomerDashboard() {
  const auth = useAuthStore();
  const loading = useAppLoading((s) => s.isActionLoading("getProducts"));
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);


  function signOut() {
    auth.logout();
  }

  return (
    <HStack h={"full"} w={"full"}>
      <Box h={"full"} bg="gray.50" w={"2/3"} minW={"40vw"} _dark={{ bg: 'gray.900' }} display={"flex"} shadow="md" borderRadius="md" p={4}>
        <VStack  h={"full"} w={"full"}>
          <HStack justify="space-between" align="flex-start" w={"full"}>
            <Box>
              <Heading size="lg">Hi {auth.user.username ?? 'Customer'}</Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }} fontSize="sm">Browse our products and add items to your cart.</Text>
            </Box>

            <HStack gap={3}>
              <Button onClick={signOut} colorScheme="red" size="sm" p={2}>Sign out</Button>
            </HStack>
          </HStack>
          <Box flex={1} overflow={"auto"} w={"full"}>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }}   gap={6} pr={2} w={"full"}>
            {loading
              ? [...Array(12)].map((_, i) => <ProductSkeleton key={i} />)
              : products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </SimpleGrid>
          </Box>


        </VStack>
      </Box>
      <VStack h={"full"} w={"1/3"}>
        <CartPopover />
        <CustomerOrders />
      </VStack>

    </HStack>
  );
}

