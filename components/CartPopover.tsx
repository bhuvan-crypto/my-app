"use client";

import React, { useEffect } from 'react';
import {
  Button,
  Box,
  HStack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useCart } from '../lib/cartStore';
import useProducts from '../lib/productsStore';
import useOrders from '../lib/ordersStore';
import type { Product } from '../lib/products';
import { useAuthStore } from '../lib/authStore';
import { useAppLoading } from '../types/api/loadingStore';

export default function CartPopover() {
  const auth = useAuthStore();
  const isAdding = useAppLoading((s) => s.isActionLoading("Cart Item add"));
  const isRemoving = useAppLoading((s) => s.isActionLoading("Cart Item delete"));
  const isOrdering = useAppLoading((s) => s.isActionLoading("Order placing"));
  const { open, onOpen, onClose } = useDisclosure();
  const cart = useCart((s) => s.cart);
  const add = useCart((s) => s.add);
  const fetchCart = useCart((s) => s.fetchCart);
  const placeOrder = useOrders((s) => s.add);
  const remove = useCart((s) => s.remove);

  const count = Object.values(cart).reduce((sum, v) => sum + v.quantity, 0);
  const products: Product[] = useProducts((s: any) => s.products);
  const total = Object.entries(cart).reduce((sum, [id, q]) => {
    const p = products.find((x) => x.id === id);
    return sum + (p ? p.price * q.quantity : 0);
  }, 0);

 

  useEffect(() => {
    fetchCart(auth.user.id);
  }, [open]);


  return (
    <Box position="relative" display="inline-block">
      <Button size="sm" onClick={open ? onClose : onOpen} aria-label="Toggle cart" p={2}>
        Cart: <strong style={{ marginLeft: 6 }}>{count}</strong>
      </Button>

      {open && (
        <Box position="absolute" right={0} top="48px" w={["xs", "xs"]} bg="white" _dark={{ bg: '#0b0b0b' }} borderWidth="1px" borderColor="gray.200" shadow="md" borderRadius="md" zIndex={30}>
          <Box p={4}>
            <Text fontSize="sm" fontWeight="semibold">Your cart</Text>

            <Box mt={3} maxH="14rem" overflowY="auto">
              {Object.keys(cart).length === 0 ? (
                <Text fontSize="xs" color="gray.500">No items in your cart.</Text>
              ) : (
                <Box>
                  {Object.entries(cart).map(([id, cart]) => {
                    const p = products.find((x) => x.id === id);
                    if (!p) return null;
                    return (
                      <HStack key={id} justifyContent="space-between" py={2} borderBottomWidth="1px" borderColor="gray.100">
                        <Box>
                          <Text fontSize="sm">{p.name}</Text>
                          <Text fontSize="xs" color="gray.500">${p.price.toFixed(2)} × {cart.quantity}</Text>
                        </Box>

                        <HStack>
                          <Button size="sm" aria-label={`Decrease ${p.name} quantity`} onClick={() => remove(cart.cartIds[0], auth.user.id, id)} loading={isRemoving}>-</Button>
                          <Text w="6" textAlign="center">{cart.quantity}</Text>
                          <Button size="sm" aria-label={`Increase ${p.name} quantity`} onClick={() => add(id, auth.user.id)} loading={isAdding} >+</Button>
                        </HStack>
                      </HStack>
                    );
                  })}
                </Box>
              )}
            </Box>

            <Box mt={3} display="flex" alignItems="center" justifyContent="space-between">
              <Text fontSize="sm" fontWeight="medium">Total</Text>
              <Text fontSize="sm" fontWeight="medium">${total.toFixed(2)}</Text>
            </Box>

            <Box mt={3} display="flex" gap={2}>
              <Button flex={1} variant="outline" onClick={onClose}>Close</Button>
              <Button flex={1} colorScheme="teal" onClick={placeOrder} loading={isOrdering}>Order</Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
