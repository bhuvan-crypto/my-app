"use client";

import React, { useEffect, useState } from "react";
import { ChakraProvider, Button, Box, defaultSystem, defaultConfig } from "@chakra-ui/react";
import { createSystem } from "@chakra-ui/react";

const system = createSystem(defaultConfig );

function Toggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check system preference or localStorage
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("chakra-ui-color-mode");
    setIsDark(stored ? stored === "dark" : prefersDark);
  }, []);

  const toggleColorMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("chakra-ui-color-mode", newMode ? "dark" : "light");
    document.documentElement.style.colorScheme = newMode ? "dark" : "light";
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box position="fixed" right={4} top={4} zIndex={50}>
      <Button size="sm" onClick={toggleColorMode} aria-label="Toggle theme">
        {isDark ? "🌙 Dark" : "☀️ Light"}
      </Button>
    </Box>
  );
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      {children}
      <Toggle />
    </ChakraProvider>
  );
}
