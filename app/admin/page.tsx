"use client";

import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ICreateProduct, updateProduct } from "../api/products";
import { useAuthStore } from "../lib/authStore";
import { PRODUCTS } from "../lib/products";
import useProducts from "../lib/productsStore";
import ProductForm from "./ProductForm";
import { useAppLoading } from "../api/loadingStore";

export default function AdminPage() {
  const products = useProducts((s) => s.products);
  const signOut = useAuthStore((s) => s.logout);
  const fetch = useProducts((s) => s.fetchProducts);
  const setProducts = useProducts((s: any) => s.set);
  const update = useProducts((s: any) => s.update);
  const remove = useProducts((s: any) => s.remove);
  const isUpdating = useAppLoading((s) => s.isActionLoading("Product update"));
  const isAdding = useAppLoading((s) => s.isActionLoading("Product add"));
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    fetch();
  }, []);

  return (
    <Box minH="100vh" py={12} px={6} bg="gray.50" _dark={{ bg: 'gray.900' }}>
      <Container maxW="4xl">
        <HStack justify="space-between" mb={6}>
          <Heading>Admin — Manage Products</Heading>
          <HStack>
            <Link href="/"><Button variant="ghost">Home</Button></Link>
            <Button colorScheme="red" onClick={signOut}>Sign out</Button>
          </HStack>
        </HStack>

        <VStack align="stretch" >
          {/* ADD FORM */}
          <Box bg="white" p={4} rounded="md" borderWidth="1px">
            <Heading size="sm" mb={3}>Add Product</Heading>
            <ProductForm
              submitText="Add Product"
              onSubmit={(data) => {
                useProducts.getState().add(data);
              }}
              loader={isAdding}

            />
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button size="sm" variant="outline" onClick={() => setProducts(PRODUCTS.slice())}>
              Reset products
            </Button>
          </Box>

          {/* EXISTING PRODUCTS */}
          <Box bg="white" p={4} rounded="md" borderWidth="1px">
            <Heading size="sm" mb={3}>Existing products</Heading>

            <VStack align="stretch">
              {products.length === 0 ? (
                <Text color="gray.600">No products.</Text>
              ) : (
                products.map((p) => (
                  <Box key={p.id}>
                    {editingId === p.id ? (
                      <ProductForm
                        defaultValues={p}
                        submitText="Save Changes"
                        onSubmit={async (data, errFn) => {
                          const res = await updateProduct(editingId, data, errFn);
                          if (res.success) {
                            setEditingId(null);
                            fetch();
                          }
                        }}
                        onCancel={() => setEditingId(null)}
                        loader={isUpdating}
                      />
                    ) : (
                      <HStack justify="space-between">
                        <Box>
                          <Text fontWeight="medium">
                            {p.name}{" "}
                            <Text as="span" color="gray.500">
                              — ${p.price.toFixed(2)}
                            </Text>
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {p.description}
                          </Text>
                        </Box>

                        <HStack>
                          <Button size="sm" onClick={() => setEditingId(p.id)}>
                            Edit
                          </Button>
                          <Button size="sm" colorScheme="red" onClick={() => remove(p.id)}>
                            Remove
                          </Button>
                        </HStack>
                      </HStack>
                    )}
                  </Box>
                ))
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
