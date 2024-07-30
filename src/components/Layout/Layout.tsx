import styles from "./Layout.module.css";
import { Header } from "@/components/Header/Header";
export const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Header />
      <main role="main" className={styles["layout-container"]}>
        <div className={styles.layout}>{children}</div>
      </main>
    </>
  );
};
