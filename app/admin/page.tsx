"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Button, Container, Heading, Text, VStack, HStack } from "@chakra-ui/react";
import AdminProductForm from "../components/AdminProductForm";
import useProducts from "../lib/productsStore";
import { PRODUCTS } from "../lib/products";
import { Input, Textarea } from "@chakra-ui/react";

export default function AdminPage() {
  const [auth, setAuth] = useState<{ token?: string; user?: { name?: string; email?: string; role?: string } } | null>(null);
  const products = useProducts((s: any) => s.products);
  const setProducts = useProducts((s: any) => s.set);
  const update = useProducts((s: any) => s.update);
  const remove = useProducts((s: any) => s.remove);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

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

  if (!auth || auth.user?.role !== "admin") {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" py={6}>
        <Container maxW="md">
          <Box bg="white" p={8} rounded="md" textAlign="center">
            <Heading size="md">Access denied</Heading>
            <Text mt={2} color="gray.600">You must sign in as an admin to view this page.</Text>
            <Box mt={4}>
              <Link href="/login"><Button colorScheme="blue">Sign in</Button></Link>
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

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
          <AdminProductForm />

          <Box display="flex" justifyContent="flex-end">
            <Button size="sm" variant="outline" onClick={() => setProducts(PRODUCTS.slice())}>Reset products</Button>
          </Box>

          <Box bg="white" p={4} rounded="md" borderWidth="1px">
            <Heading size="sm" mb={3}>Existing products</Heading>
            <VStack align="stretch" >
              {products.length === 0 ? (
                <Text color="gray.600">No products.</Text>
              ) : (
                products.map((p: any) => (
                  <HStack key={p.id} justify="space-between" align="start">
                    {editingId === p.id ? (
                      <Box flex={1}>
                        <Input mb={2} value={editName} onChange={(e) => setEditName(e.target.value)} />
                        <Input mb={2} value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="0.00" />
                        <Textarea mb={2} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                      </Box>
                    ) : (
                      <Box>
                        <Text fontWeight="medium">{p.name} <Text as="span" fontWeight="normal" color="gray.500">— ${p.price.toFixed(2)}</Text></Text>
                        <Text fontSize="sm" color="gray.600">{p.description}</Text>
                      </Box>
                    )}

                    <HStack>
                      {editingId === p.id ? (
                        <>
                          <Button size="sm" colorScheme="green" onClick={() => {
                            const parsed = parseFloat(editPrice as string) || 0;
                            update(p.id, { name: editName || p.name, price: parsed, description: editDescription });
                            setEditingId(null);
                          }}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => {
                            setEditingId(p.id);
                            setEditName(p.name);
                            setEditPrice(String(p.price));
                            setEditDescription(p.description || "");
                          }}>Edit</Button>
                          <Button colorScheme="red" size="sm" onClick={() => remove(p.id)}>Remove</Button>
                        </>
                      )}
                    </HStack>
                  </HStack>
                ))
              )}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
