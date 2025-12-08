"use client";

import { Box, Button, Container, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ICreateProduct, updateProduct } from "../../api/products";
import { useAuthStore } from "../../lib/authStore";
import { PRODUCTS } from "../../lib/products";
import useProducts from "../../lib/productsStore";
import ProductForm from "../../components/ProductForm";
import { useAppLoading } from "../../api/loadingStore";
import AnalyticsPage from "./components/analytics/page";

export default function AdminPage() {
  const products = useProducts((s) => s.products);
  const signOut = useAuthStore((s) => s.logout);
  const fetch = useProducts((s) => s.fetchProducts);
  const setProducts = useProducts((s: any) => s.set);
  const remove = useProducts((s: any) => s.remove);
  const isUpdating = useAppLoading((s) => s.isActionLoading("Product update"));
  const isAdding = useAppLoading((s) => s.isActionLoading("Product add"));
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    fetch();
  }, []);
  const editProduct = useMemo(() => {
    return products.find((p) => p.id === editingId)
  }, [editingId])


  return (
    <HStack w={"full"} h={"full"} pos={"relative"}>
      <Button colorScheme="red" pos={"absolute"}  right={0} top={0} onClick={signOut}>Sign out</Button>
      <AnalyticsPage />
      <Box minW={"30vw"} p={4}h={"full"}margin={"auto"}
       borderRadius={10}>
        <VStack maxW="4xl" h={"full"} gap={4}>
          <HStack justify="space-between" w={"full"}>
            <Heading>Manage Products</Heading>
           
          </HStack>

          <VStack align="stretch" flex={1} overflow={"auto"} w={"full"}>
            {/* ADD FORM */}
            <Box p={4} rounded="md" borderWidth="1px" bg="gray.50" >
              <Heading size="sm" mb={3}>Add Product</Heading>
              {editProduct && editingId ? <ProductForm
                defaultValues={editProduct}
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
              /> : <ProductForm
                submitText="Add Product"
                onSubmit={(data) => {
                  useProducts.getState().add(data);
                }}
                loader={isAdding}
              />}
            </Box>

            {/* EXISTING PRODUCTS */}
            <Box p={4} rounded="md" borderWidth="1px" flex={1} overflow={"auto"}  bg="gray.50" >
              <Heading size="sm" mb={3}>Existing products</Heading>

              <VStack align="stretch" flex={1} overflow={"auto"}>
                {products.length === 0 ? (
                  <Text color="gray.600">No products.</Text>
                ) : (
                  products.map((p) => (
                    <Box key={p.id}>

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

                    </Box>
                  ))
                )}
              </VStack>
            </Box>
          </VStack>
        </VStack>

      </Box>
    </HStack>
  );
}
