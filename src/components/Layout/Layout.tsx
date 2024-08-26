"use client";

import { useEffect, useState } from "react";
import styles from "./Layout.module.css";
import { Header } from "@/components/Header/Header";
export const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return <></>;
  if (isMounted)
    return (
      <>
        <Header />
        <main role="main" className={styles["layout-container"]}>
          <div className={styles.layout}>{children}</div>
        </main>
      </>
    );
};
