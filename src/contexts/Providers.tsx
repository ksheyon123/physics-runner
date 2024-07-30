"use client";

import React, { ReactNode } from "react";

import { ThemeProvider } from "styled-components";

export const Providers = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider theme={{}}>
      <>{children}</>
    </ThemeProvider>
  );
};
