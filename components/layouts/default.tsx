import { PropsWithChildren } from "react";
import styles from "./default.module.css";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  );
}
