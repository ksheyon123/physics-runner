"use client";

import React, { ReactNode } from "react";

import { ThemeProvider } from "styled-components";

export interface IProps {
  children: ReactNode;
}

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
