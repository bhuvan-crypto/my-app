"use client";

import React, { useState } from "react";
import { Box, Button, Input, Textarea, HStack, Text } from "@chakra-ui/react";
import useProducts from "../lib/productsStore";

export default function AdminProductForm() {
  const add = useProducts((s: any) => s.add);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(price as string) || 0;
    if (!name) return;
    add({ name, price: parsed, description });
    setName("");
    setPrice("");
    setDescription("");
  }

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} bg="white" _dark={{ bg: 'gray.800' }} borderRadius="md" borderWidth="1px">
      <Box mb={3}>
        <Text mb={2} fontSize="sm" fontWeight="medium">Name</Text>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Box>

      <Box mb={3}>
        <Text mb={2} fontSize="sm" fontWeight="medium">Price</Text>
        <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
      </Box>

      <Box mb={3}>
        <Text mb={2} fontSize="sm" fontWeight="medium">Description</Text>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </Box>

      <HStack>
        <Button type="submit" colorScheme="green">Add product</Button>
      </HStack>
    </Box>
  );
}
